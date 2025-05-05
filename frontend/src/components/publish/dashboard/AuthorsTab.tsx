import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import type { DashboardData } from "./types";
import { useLocal } from "@/lib/hooks/use-local";
import type { FormEvent } from "react";
import { api } from "@/lib/gen/publish.esensi";
import { betterAuth } from "@/lib/better-auth";
import { MoreHorizontal, UserPlus } from "lucide-react";

interface AuthorsTabProps {
  data: DashboardData;
}

export const AuthorsTab = ({ data }: AuthorsTabProps) => {
  const { authors = [] } = data;

  const local = useLocal({
    searchQuery: "",
    filteredAuthors: authors,
    isDialogOpen: false,
    newAuthorData: {
      name: "",
      email: ""
    },
    isSubmitting: false,
    error: "",
    success: "",
    newAuthorId: ""
  }, async () => {
    local.filteredAuthors = authors;
    local.render();
  });

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    
    if (local.searchQuery.trim() === "") {
      local.filteredAuthors = authors;
    } else {
      const filtered = authors.filter(author => 
        author.name.toLowerCase().includes(local.searchQuery.toLowerCase()) ||
        (author.auth_user?.[0]?.email && author.auth_user[0].email.toLowerCase().includes(local.searchQuery.toLowerCase()))
      );
      local.filteredAuthors = filtered;
    }
    
    local.render();
  };

  const handleAddAuthor = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!local.newAuthorData.name || !local.newAuthorData.email) {
      local.error = "Mohon isi semua kolom";
      local.render();
      return;
    }
    
    local.isSubmitting = true;
    local.error = "";
    local.success = "";
    local.render();
    
    try {
      const userInfo = await betterAuth.getSession();
      if (!userInfo.data?.user) {
        local.error = "Sesi tidak valid";
        local.render();
        return;
      }
      
      const authorResponse = await api.onboarding({
        role: "author",
        user: userInfo.data.user
      });
      
      if (!authorResponse.success || !authorResponse.author?.id) {
        local.error = authorResponse.message || "Gagal membuat penulis baru";
        local.isSubmitting = false;
        local.render();
        return;
      }
      
      const authorId = authorResponse.author.id;
      
      const result = await api.publisher_authors({
        user: userInfo.data.user,
        action: 'add',
        author_id: authorId
      });
      
      if (result.success) {
        local.success = "Penulis baru berhasil ditambahkan";
        local.newAuthorData = { name: "", email: "" };
        local.isDialogOpen = false;
        
        const authorsRes = await api.publisher_authors({
          user: userInfo.data.user,
          action: 'list'
        });
        
        if (authorsRes.success && Array.isArray(authorsRes.data)) {
          local.filteredAuthors = authorsRes.data;
        }
      } else {
        local.error = result.message || "Gagal menambahkan penulis";
      }
    } catch (error) {
      console.error("Error adding author:", error);
      local.error = "Terjadi kesalahan saat menambahkan penulis";
    } finally {
      local.isSubmitting = false;
      local.render();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Penulis</h1>
        <Dialog open={local.isDialogOpen} onOpenChange={(open) => {
          local.isDialogOpen = open;
          local.render();
        }}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Tambah Penulis
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Penulis Baru</DialogTitle>
              <DialogDescription>
                Tambahkan penulis baru ke dalam publisher Anda.
                Penulis akan menerima email undangan.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleAddAuthor} className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nama Penulis
                </label>
                <Input
                  id="name"
                  value={local.newAuthorData.name}
                  onChange={e => {
                    local.newAuthorData.name = e.target.value;
                    local.render();
                  }}
                  placeholder="Masukkan nama penulis"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={local.newAuthorData.email}
                  onChange={e => {
                    local.newAuthorData.email = e.target.value;
                    local.render();
                  }}
                  placeholder="Masukkan email penulis"
                />
              </div>
              
              {local.error && (
                <p className="text-sm text-red-500">{local.error}</p>
              )}
              
              {local.success && (
                <p className="text-sm text-green-500">{local.success}</p>
              )}
              
              <DialogFooter>
                <Button type="submit" disabled={local.isSubmitting}>
                  {local.isSubmitting ? "Menambahkan..." : "Tambah Penulis"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Search */}
      <form onSubmit={handleSearch} className="relative max-w-md">
        <Input
          placeholder="Cari penulis..."
          value={local.searchQuery}
          onChange={e => {
            local.searchQuery = e.target.value;
            local.render();
          }}
          className="w-full"
        />
        <Button 
          type="submit" 
          variant="ghost" 
          size="sm" 
          className="absolute right-0 top-0 h-full"
        >
          Cari
        </Button>
      </form>
      
      {/* Authors table */}
      {local.filteredAuthors && local.filteredAuthors.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Jumlah Produk</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {local.filteredAuthors.map(author => (
                <TableRow key={author.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{author.name}</TableCell>
                  <TableCell>{author.auth_user?.[0]?.email || "-"}</TableCell>
                  <TableCell>{author.productCount || 0}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Aksi</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          Lihat Produk
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-muted/40 rounded-lg p-8 text-center">
          <p className="text-muted-foreground mb-4">Belum ada penulis di publisher Anda</p>
          <Button onClick={() => {
            local.isDialogOpen = true;
            local.render();
          }}>
            <UserPlus className="mr-2 h-4 w-4" />
            Tambah Penulis
          </Button>
        </div>
      )}
    </div>
  );
};