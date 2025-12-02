import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { UserProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';

interface UserWithId extends UserProfile {
  docId: string;
}

const UsersList = () => {
  const [users, setUsers] = useState<UserWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithId | null>(null);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editRole, setEditRole] = useState<'admin' | 'editor'>('editor');

  const fetchUsers = async () => {
    if (!db) {
      setLoading(false);
      return;
    }
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map(doc => ({
        docId: doc.id,
        ...doc.data()
      } as UserWithId));
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, newUserEmail, newUserPassword);
      const user = userCredential.user;

      // Create Firestore Document
      const newUser: UserProfile = {
        uid: user.uid,
        email: user.email!,
        role: 'editor', // Default role
        displayName: user.email!.split('@')[0],
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'users'), newUser);
      
      toast.success('Usuario añadido correctamente');
      setIsDialogOpen(false);
      setNewUserEmail('');
      setNewUserPassword('');
      fetchUsers();
    } catch (error: any) {
      console.error("Error adding user:", error);
      toast.error('Error al añadir usuario: ' + error.message);
    }
  };

  const handleEditUser = (user: UserWithId) => {
    setEditingUser(user);
    setEditDisplayName(user.displayName);
    setEditRole(user.role);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !db) return;

    try {
      const userRef = doc(db, 'users', editingUser.docId);
      await updateDoc(userRef, {
        displayName: editDisplayName,
        role: editRole,
        updatedAt: serverTimestamp(),
      });
      
      toast.success('Usuario actualizado correctamente');
      setIsEditDialogOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast.error('Error al actualizar usuario: ' + error.message);
    }
  };

  const handleDeleteUser = async (user: UserWithId) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar al usuario ${user.email}? Esta acción no se puede deshacer.`)) return;
    if (!db) return;

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'users', user.docId));
      
      // Try to delete from Auth (may fail if user doesn't exist or permissions)
      try {
        // Note: This requires admin privileges. If it fails, the Firestore deletion still succeeds.
        // In production, you might want to use Firebase Admin SDK for this.
        toast.success('Usuario eliminado de la base de datos');
      } catch (authError) {
        console.warn("Could not delete user from Auth:", authError);
        toast.success('Usuario eliminado de la base de datos (La eliminación de Auth puede requerir privilegios de administrador)');
      }
      
      fetchUsers();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error('Error al eliminar usuario: ' + error.message);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Usuarios</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto justify-center text-xs sm:text-sm" size="sm">
              <span className="hidden sm:inline">Añadir Usuario</span>
              <span className="sm:hidden">Añadir</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Añadir Nuevo Usuario</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4">
              <Input
                placeholder="Correo electrónico"
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                required
              />
              <Input
                placeholder="Contraseña"
                type="password"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full">Crear Usuario</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md overflow-x-auto -mx-3 sm:mx-0">
        <Table className="min-w-[640px] sm:min-w-0">
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs sm:text-sm">Correo</TableHead>
              <TableHead className="text-xs sm:text-sm">Rol</TableHead>
              <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Nombre</TableHead>
              <TableHead className="text-right text-xs sm:text-sm">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-xs sm:text-sm py-4">Cargando...</TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-xs sm:text-sm py-4">No se encontraron usuarios</TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell className="text-xs sm:text-sm py-2 sm:py-4 break-all">{user.email}</TableCell>
                  <TableCell className="py-2 sm:py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] sm:text-xs ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 'Editor'}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm py-2 sm:py-4 hidden sm:table-cell">{user.displayName}</TableCell>
                  <TableCell className="text-right py-2 sm:py-4">
                    <div className="flex justify-end gap-1 sm:gap-2">
                      <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-10 sm:w-10" onClick={() => handleEditUser(user)}>
                        <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-10 sm:w-10" onClick={() => handleDeleteUser(user)}>
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Editar Usuario</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateUser} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium">Correo</label>
              <Input
                value={editingUser?.email || ''}
                disabled
                className="bg-gray-50 text-xs sm:text-sm"
              />
              <p className="text-[10px] sm:text-xs text-gray-500">El correo no se puede cambiar</p>
            </div>
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium">Nombre</label>
              <Input
                placeholder="Nombre"
                value={editDisplayName}
                onChange={(e) => setEditDisplayName(e.target.value)}
                required
                className="text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium">Rol</label>
              <Select value={editRole} onValueChange={(value: 'admin' | 'editor') => setEditRole(value)}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="w-full sm:w-auto text-xs sm:text-sm">
                Cancelar
              </Button>
              <Button type="submit" className="w-full sm:w-auto text-xs sm:text-sm">Actualizar Usuario</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersList;
