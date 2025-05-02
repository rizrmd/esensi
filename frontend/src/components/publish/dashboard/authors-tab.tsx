import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { navigate } from "@/lib/router";
import type { DashboardData } from "./types";

interface AuthorsTabProps {
  data: DashboardData;
}

export const AuthorsTab = ({ data }: AuthorsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Penulis</h1>
        <Button onClick={() => navigate('/publish/add-author')}>
          + Tambah Penulis
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(data.authors || []).map((author) => (
          <Card key={author.id}>
            <CardHeader>
              <CardTitle className="text-xl">{author.name}</CardTitle>
              <CardDescription>
                {author.auth_user?.[0]?.email || ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <span className="font-medium">Total Produk:</span>
                <span>{author.productCount || 0}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button 
                variant="outline"
                onClick={() => navigate(`/publish/author/${author.id}`)}
              >
                Lihat Detail
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        {(data.authors || []).length === 0 && (
          <Card className="col-span-full p-6 text-center">
            <p className="text-muted-foreground">
              Belum ada penulis yang terdaftar. Klik tombol "Tambah Penulis" untuk menambahkan.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};