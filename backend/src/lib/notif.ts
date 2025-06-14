import type { Server, WebSocketHandler } from "bun";

export enum NotifType {
  BOOK_CREATE = "book-create",
  BOOK_UPDATE = "book-update",
  BOOK_SUBMIT = "book-submit",
  BOOK_REVISE = "book-revise",
  BOOK_PUBLISH = "book-publish",
  BOOK_REJECT = "book-reject",
  BOOK_APPROVE = "book-approve",
}

export enum NotifStatus {
  UNREAD = "unread",
  READ = "read",
}

export type NotifItem = {
  timestamp?: number;
  type: NotifType;
  message: string;
  status: NotifStatus;
  url?: string;
  data?: Record<string, string | number | boolean | Date | object>;
  thumbnail?: string;
};

export enum WSMessageAction {
  CONNECTED = "connected",
  NEW_NOTIF = "new-notif",
}

export type WSMessage =
  | { action: WSMessageAction.CONNECTED; notifList: NotifItem[] }
  | { action: WSMessageAction.NEW_NOTIF; notif: NotifItem };

type WSType = Bun.ServerWebSocket<{ user_id: string }>;

const conns = {} as Record<
  string,
  {
    wsClients: Set<WSType>;
    notifList: NotifItem[];
  }
>;

export type WSNotif = WebSocketHandler<object> & {
  upgrade?: (opt: { req: Request; server: Server }) => object | Promise<object>;
};

export const wsNotif: WSNotif = {
  async message(ws: WSType, message) {
    const msg = JSON.parse(message as string) as { uid: string };

    if (!conns[msg.uid])
      conns[msg.uid] = { wsClients: new Set(), notifList: [] };
    const conn = conns[msg.uid];

    if (conn) {
      ws.data.user_id = msg.uid;
      conn.wsClients.add(ws);

      const list = await db.notif.findMany({
        where: { id_user: msg.uid },
        orderBy: { created_at: "desc" },
      });

      conn.notifList = list.map((notif) => ({
        type: notif.type as NotifType,
        message: notif.message,
        status: notif.status as NotifStatus,
        url: !notif.url ? undefined : notif.url,
        data: !notif.data
          ? undefined
          : (notif.data as Record<
              string,
              string | number | boolean | Date | object
            >),
        timestamp: notif.created_at.getTime(),
        thumbnail: !notif.thumbnail ? undefined : notif.thumbnail,
      }));

      await sendNotif(msg.uid, {
        action: WSMessageAction.CONNECTED,
        notifList: conn.notifList,
      });
    }
  },

  close(ws: WSType) {
    const conn = conns[ws.data.user_id]?.wsClients;
    if (conn) {
      conn.delete(ws);
    }
  },
};

export const sendNotif = async (uid: string, message: WSMessage) => {
  const wsClients = conns[uid]?.wsClients;
  if (wsClients) {
    if (message.action === WSMessageAction.NEW_NOTIF) {
      const notif = await db.notif.create({
        data: {
          id_user: uid,
          type: message.notif.type,
          message: message.notif.message,
          status: message.notif.status,
          url: message.notif.url,
          data: message.notif.data,
          thumbnail: message.notif.thumbnail,
        },
      });
    }

    wsClients.forEach((ws: WSType) => {
      ws.send(JSON.stringify(message));
    });
  }
};
