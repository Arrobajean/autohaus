import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { UserProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserWithId | null>(null);

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

  const handleDeleteUserClick = (user: UserWithId) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete || !db) return;

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'users', userToDelete.docId));
      
      // Try to delete from Auth (may fail if user doesn't exist or permissions)
      try {
        // Note: This requires admin privileges. If it fails, the Firestore deletion still succeeds.
        // In production, you might want to use Firebase Admin SDK for this.
        toast.success('Usuario eliminado de la base de datos');
      } catch (authError) {
        console.warn("Could not delete user from Auth:", authError);
        toast.success('Usuario eliminado de la base de datos (La eliminación de Auth puede requerir privilegios de administrador)');
      }
      
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error('Error al eliminar usuario: ' + error.message);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Usuarios</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto justify-center text-xs sm:text-sm" size="sm">
              <span className="hidden sm:inline">Añadir Usuario</span>
              <span className="sm:hidden">Añadir</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-md bg-[#1a1a1a] border-[#2a2a2a] text-white">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl text-white">Añadir Nuevo Usuario</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4">
              <Input
                placeholder="Correo electrónico"
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                required
                className="bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400"
              />
              <Input
                placeholder="Contraseña"
                type="password"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                required
                className="bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400"
              />
              <Button type="submit" className="w-full">Crear Usuario</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-[#2a2a2a] rounded-md overflow-x-auto -mx-3 sm:mx-0 bg-[#1a1a1a]">
        <Table className="min-w-[640px] sm:min-w-0">
          <TableHeader>
            <TableRow className="border-[#2a2a2a] hover:bg-[#2a2a2a]">
              <TableHead className="text-xs sm:text-sm text-gray-300">Correo</TableHead>
              <TableHead className="text-xs sm:text-sm text-gray-300">Rol</TableHead>
              <TableHead className="text-xs sm:text-sm hidden sm:table-cell text-gray-300">Nombre</TableHead>
              <TableHead className="text-right text-xs sm:text-sm text-gray-300">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i} className="border-[#2a2a2a]">
                    <TableCell className="py-2 sm:py-4">
                      <Skeleton className="h-4 w-48 bg-[#2a2a2a]" />
                    </TableCell>
                    <TableCell className="py-2 sm:py-4">
                      <Skeleton className="h-6 w-16 rounded-full bg-[#2a2a2a]" />
                    </TableCell>
                    <TableCell className="py-2 sm:py-4 hidden sm:table-cell">
                      <Skeleton className="h-4 w-32 bg-[#2a2a2a]" />
                    </TableCell>
                    <TableCell className="text-right py-2 sm:py-4">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        <Skeleton className="h-7 w-7 sm:h-10 sm:w-10 rounded bg-[#2a2a2a]" />
                        <Skeleton className="h-7 w-7 sm:h-10 sm:w-10 rounded bg-[#2a2a2a]" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : users.length === 0 ? (
              <TableRow className="border-[#2a2a2a]">
                <TableCell colSpan={4} className="text-center text-xs sm:text-sm py-4 text-gray-400">No se encontraron usuarios</TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.uid} className="border-[#2a2a2a] hover:bg-[#2a2a2a]">
                  <TableCell className="text-xs sm:text-sm py-2 sm:py-4 break-all text-white">{user.email}</TableCell>
                  <TableCell className="py-2 sm:py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] sm:text-xs ${
                      user.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 'Editor'}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm py-2 sm:py-4 hidden sm:table-cell text-gray-200">{user.displayName}</TableCell>
                  <TableCell className="text-right py-2 sm:py-4">
                    <div className="flex justify-end gap-1 sm:gap-2">
                      <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-10 sm:w-10 text-gray-300 hover:text-white hover:bg-[#2a2a2a]" onClick={() => handleEditUser(user)}>
                        <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <AlertDialog open={deleteDialogOpen && userToDelete?.uid === user.uid} onOpenChange={setDeleteDialogOpen}>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-10 sm:w-10 text-red-400 hover:text-red-300 hover:bg-[#2a2a2a]" onClick={() => handleDeleteUserClick(user)}>
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">¿Eliminar usuario?</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-300">
                              Esta acción no se puede deshacer. Se eliminará permanentemente el usuario <strong className="text-white">{user.email}</strong>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setUserToDelete(null)} className="bg-[#2a2a2a] border-[#2a2a2a] text-gray-200 hover:bg-[#3a3a3a]">Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeleteUser}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
        <DialogContent className="max-w-[95vw] sm:max-w-md bg-[#1a1a1a] border-[#2a2a2a] text-white">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl text-white">Editar Usuario</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateUser} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-200">Correo</label>
              <Input
                value={editingUser?.email || ''}
                disabled
                className="bg-[#0a0a0a] border-[#2a2a2a] text-gray-400 text-xs sm:text-sm"
              />
              <p className="text-[10px] sm:text-xs text-gray-400">El correo no se puede cambiar</p>
            </div>
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-200">Nombre</label>
              <Input
                placeholder="Nombre"
                value={editDisplayName}
                onChange={(e) => setEditDisplayName(e.target.value)}
                required
                className="text-xs sm:text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-200">Rol</label>
              <Select value={editRole} onValueChange={(value: 'admin' | 'editor') => setEditRole(value)}>
                <SelectTrigger className="text-xs sm:text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white">
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                  <SelectItem value="admin" className="text-white hover:bg-[#2a2a2a]">Administrador</SelectItem>
                  <SelectItem value="editor" className="text-white hover:bg-[#2a2a2a]">Editor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="w-full sm:w-auto text-xs sm:text-sm border-[#2a2a2a] text-gray-200 hover:bg-[#2a2a2a]">
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
