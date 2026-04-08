// Mock users for role-based authentication testing

export const MOCK_USERS = [
  {
    id: 'user-admin',
    email: 'admin@nexatrack.com',
    password: 'admin',
    name: 'Admin User',
    role: 'admin',
    meterIds: [], // Admins don't have a specific meter
  },
  {
    id: 'user-tenant-1',
    email: 'kwame@nexatrack.com',
    password: 'tenant123',
    name: 'Kwame Asante',
    role: 'tenant',
    meterIds: ['meter-1', 'meter-5'], // Kwame has 2 meters
  },
  {
    id: 'user-tenant-2',
    email: 'ama@nexatrack.com',
    password: 'tenant123',
    name: 'Ama Mensah',
    role: 'tenant',
    meterIds: ['meter-2'],
  },
  {
    id: 'user-tenant-3',
    email: 'kofi@nexatrack.com',
    password: 'tenant123',
    name: 'Kofi Boateng',
    role: 'tenant',
    meterIds: ['meter-3'],
  },
  {
    id: 'user-tenant-4',
    email: 'efua@nexatrack.com',
    password: 'tenant123',
    name: 'Efua Darko',
    role: 'tenant',
    meterIds: ['meter-4'],
  }
];

export function authenticate(email, password) {
  const user = MOCK_USERS.find(
    (u) => u.email === email && u.password === password
  );
  if (user) {
    // Return a safe copy of the user object without the password
    const { password: _, ...safeUser } = user;
    return safeUser;
  }
  return null;
}
