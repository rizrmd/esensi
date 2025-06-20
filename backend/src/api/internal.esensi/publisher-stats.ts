import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "publisher_stats",
  url: "/api/internal/publisher/stats",
  async handler(arg: { id?: string }) {
    const { id } = arg;

    if (id) {
      // Get stats for specific publisher
      const publisher = await db.publisher.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          website: true,
          _count: {
            select: {
              publisher_author: true,
              promo_code: true,
              transaction: true,
              withdrawal: true,
              t_ai_credit: true,
              auth_user: true,
            },
          },
        },
      });

      if (!publisher) throw new Error("Publisher tidak ditemukan");

      // Get transaction total amount for this publisher
      const transactionTotal = await db.transaction.aggregate({
        where: { id_publisher: id },
        _sum: { amount: true },
      });

      // Get withdrawal total amount for this publisher
      const withdrawalTotal = await db.withdrawal.aggregate({
        where: { id_publisher: id },
        _sum: { amount: true },
      });

      return {
        publisher: {
          id: publisher.id,
          name: publisher.name,
          website: publisher.website,
          author_count: publisher._count.publisher_author,
          promo_code_count: publisher._count.promo_code,
          transaction_count: publisher._count.transaction,
          transaction_total: transactionTotal._sum?.amount || 0,
          withdrawal_count: publisher._count.withdrawal,
          withdrawal_total: withdrawalTotal._sum?.amount || 0,
          ai_credit_count: publisher._count.t_ai_credit,
          user_count: publisher._count.auth_user,
        },
      };
    } else {
      // Get overall stats
      const [
        totalPublishers,
        publishersWithAuthors,
        publishersWithPromoCodes,
        publishersWithTransactions,
        publishersWithWithdrawals,
        publishersWithAiCredit,
        publishersWithUsers,
      ] = await Promise.all([
        db.publisher.count(),
        db.publisher.count({ where: { publisher_author: { some: {} } } }),
        db.publisher.count({ where: { promo_code: { some: {} } } }),
        db.publisher.count({ where: { transaction: { some: {} } } }),
        db.publisher.count({ where: { withdrawal: { some: {} } } }),
        db.publisher.count({ where: { t_ai_credit: { some: {} } } }),
        db.publisher.count({ where: { auth_user: { some: {} } } }),
      ]);

      // Get total transaction amount
      const totalTransactionAmount = await db.transaction.aggregate({
        _sum: { amount: true },
      });

      // Get total withdrawal amount
      const totalWithdrawalAmount = await db.withdrawal.aggregate({
        _sum: { amount: true },
      });

      return {
        overview: {
          total_publishers: totalPublishers,
          publishers_with_authors: publishersWithAuthors,
          publishers_with_promo_codes: publishersWithPromoCodes,
          publishers_with_transactions: publishersWithTransactions,
          publishers_with_withdrawals: publishersWithWithdrawals,
          publishers_with_ai_credit: publishersWithAiCredit,
          publishers_with_users: publishersWithUsers,
          total_transaction_amount: totalTransactionAmount._sum?.amount || 0,
          total_withdrawal_amount: totalWithdrawalAmount._sum?.amount || 0,
        },
      };
    }
  },
});
