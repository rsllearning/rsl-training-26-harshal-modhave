import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './styles.css';

const queryClient = new QueryClient();

// Simulated API Store
let mockUsers = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob Jones', email: 'bob@example.com', role: 'User' },
];

const api = {
  getUsers: async () => {
    await new Promise((res) => setTimeout(res, 500));
    return [...mockUsers];
  },
  createUser: async (newUser) => {
    await new Promise((res) => setTimeout(res, 800));
    const created = { id: Date.now(), ...newUser };
    mockUsers.push(created);
    return created;
  },
  deleteUser: async (id) => {
    await new Promise((res) => setTimeout(res, 800));
    // Simulated intentional failure if needed:
    // if (Math.random() > 0.5) throw new Error("Delete request failed on server!");
    mockUsers = mockUsers.filter((u) => u.id !== id);
    return id;
  },
};

// Custom Hook 1: useUsers
function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: api.getUsers,
  });
}

// Custom Hook 2: useCreateUser
function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Custom Hook 3: useDeleteUser with Optimistic Update
function useDeleteUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.deleteUser,
    onMutate: async (deletedUserId) => {
      // 1. Cancel in-flight queries
      await qc.cancelQueries({ queryKey: ['users'] });

      // 2. Snapshot current data
      const previousUsers = qc.getQueryData(['users']);

      // 3. Optimistically update cache
      qc.setQueryData(['users'], (old = []) =>
        old.filter((user) => user.id !== deletedUserId)
      );

      // 4. Return context snapshot for rollback
      return { previousUsers };
    },
    onError: (err, deletedUserId, context) => {
      // Rollback on failure
      if (context?.previousUsers) {
        qc.setQueryData(['users'], context.previousUsers);
      }
    },
    onSettled: () => {
      // Synchronize with server after completion
      qc.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

function UserManagementApp() {
  const { data: users = [], isPending, isError, error } = useUsers();
  const createUserMutation = useCreateUser();
  const deleteUserMutation = useDeleteUser();

  const [formData, setFormData] = useState({ name: '', email: '', role: 'User' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    createUserMutation.mutate(formData, {
      onSuccess: () => {
        setFormData({ name: '', email: '', role: 'User' });
      },
    });
  };

  return (
    <div className="container">
      <h2>Exercise 2: User Management</h2>

      {/* Add User Form */}
      <div className="form-card">
        <h3>Create New User</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button type="submit" disabled={createUserMutation.isPending}>
            {createUserMutation.isPending ? 'Creating...' : 'Add User'}
          </button>
        </form>

        {createUserMutation.isError && (
          <div className="status-msg error">
            Failed to create user: {createUserMutation.error.message}
          </div>
        )}
        {createUserMutation.isSuccess && (
          <div className="status-msg success">User created successfully!</div>
        )}
      </div>

      {/* User List */}
      <h3>Users List</h3>
      {isPending && <p>Loading users...</p>}
      {isError && <p className="status-msg error">Error loading users: {error.message}</p>}

      {deleteUserMutation.isError && (
        <div className="status-msg error">
          Failed to delete user. Cache restored! ({deleteUserMutation.error.message})
        </div>
      )}

      <div className="user-list">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <div>
              <strong>{user.name}</strong> ({user.role})<br />
              <small>{user.email}</small>
            </div>
            <button
              className="delete-btn"
              onClick={() => deleteUserMutation.mutate(user.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserManagementApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);