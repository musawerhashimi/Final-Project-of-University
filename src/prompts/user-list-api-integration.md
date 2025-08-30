import React, { useState, useEffect, useRef } from "react";

// ========= TYPE DEFINITIONS =========
enum Branch {
  MAIN_ST = "Main St. Office",
  WEST_END = "West End Hub",
  NORTH_HQ = "Northern HQ",
  EAST_WING = "East Wing Complex",
}

type User = {
  id: number;
  firstname: string;
  lastname: string;
  photo: string;
  username: string;
  phone: string;
  email: string;
  role: string;
  branch: Branch;
};

// ========= MOCK DATA =========
const mockUsers: User[] = [
  {
    id: 1,
    firstname: "Alicia",
    lastname: "Vega",
    username: "aliciav",
    photo:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=2574&auto=format&fit=crop",
    phone: "555-123-4567",
    email: "alicia.v@example.com",
    role: "Admin",
    branch: Branch.MAIN_ST,
  },
  {
    id: 2,
    firstname: "Ben",
    lastname: "Carter",
    username: "benc",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop",
    phone: "555-987-6543",
    email: "ben.carter@example.com",
    role: "Manager",
    branch: Branch.WEST_END,
  },
  {
    id: 3,
    firstname: "Clara",
    lastname: "Jones",
    username: "claraj",
    photo:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2564&auto=format&fit=crop",
    phone: "555-456-7890",
    email: "clara.j@example.com",
    role: "Developer",
    branch: Branch.NORTH_HQ,
  },
];

const branchOptions: Branch[] = Object.values(Branch);

// ========= THEME COLOR DEFINITIONS & TAILWIND CONFIG =========
/*
  !!! MANDATORY SETUP !!!

  1. Place this CSS in your global CSS file (e.g., index.css):
  ------------------------------------------------------------------
  :root {
    --color-background-primary-users: #f8fafc;
    --color-background-secondary-users: #ffffff;
    --color-background-accent-users: #f1f5f9;
    --color-text-primary-users: #0f172a;
    --color-text-secondary-users: #64748b;
    --color-border-primary-users: #e2e8f0;
    --color-accent-primary-users: #4f46e5;
    --color-accent-hover-users: #4338ca;
  }

  .dark {
    --color-background-primary-users: #0f172a;
    --color-background-secondary-users: #1e293b;
    --color-background-accent-users: #334155;
    --color-text-primary-users: #e2e8f0;
    --color-text-secondary-users: #94a3b8;
    --color-border-primary-users: #334155;
    --color-accent-primary-users: #6366f1;
    --color-accent-hover-users: #818cf8;
  }
  ------------------------------------------------------------------

  2. Add this configuration to your `tailwind.config.js` file
     to make classes like `bg-background-primary-users` work:
  ------------------------------------------------------------------
  module.exports = {
    // ...your other config
    theme: {
      extend: {
        colors: {
          'background-primary-users': 'var(--color-background-primary-users)',
          'background-secondary-users': 'var(--color-background-secondary-users)',
          'background-accent-users': 'var(--color-background-accent-users)',
          'text-primary-users': 'var(--color-text-primary-users)',
          'text-secondary-users': 'var(--color-text-secondary-users)',
          'border-primary-users': 'var(--color-border-primary-users)',
          'accent-primary-users': 'var(--color-accent-primary-users)',
          'accent-hover-users': 'var(--color-accent-hover-users)',
        }
      }
    }
  }
  ------------------------------------------------------------------
*/

// ========= SVG ICONS =========
const UserPlusIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...p}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <line x1="19" x2="19" y1="8" y2="14"></line>
    <line x1="22" x2="16" y1="11" y2="11"></line>
  </svg>
);
const MailIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...p}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);
const PhoneIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...p}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);
const BuildingIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...p}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect>
    <path d="M9 22v-4h6v4"></path>
    <path d="M8 6h.01"></path>
    <path d="M16 6h.01"></path>
    <path d="M12 6h.01"></path>
    <path d="M12 10h.01"></path>
    <path d="M12 14h.01"></path>
    <path d="M16 10h.01"></path>
    <path d="M16 14h.01"></path>
    <path d="M8 10h.01"></path>
    <path d="M8 14h.01"></path>
  </svg>
);
const XIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...p}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18"></path>
    <path d="m6 6 12 12"></path>
  </svg>
);

// ========= CHILD COMPONENTS =========

/**
 * UserCard Component (New Horizontal Design)
 */
const UserCard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="bg-background-secondary-users rounded-xl shadow-sm border border-border-primary-users p-4 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5 transition-all duration-300 hover:shadow-lg hover:border-accent-primary-users">
      <img
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover flex-shrink-0"
        src={user.photo}
        alt={`${user.firstname} ${user.lastname}`}
        onError={(e) => {
          (
            e.target as HTMLImageElement
          ).src = `https://placehold.co/128x128/f87171/ffffff?text=Error`;
        }}
      />
      <div className="flex-grow text-center sm:text-left">
        <span className="text-xs font-semibold bg-background-accent-users text-accent-primary-users px-2 py-1 rounded-full">
          {user.role}
        </span>
        <h3 className="text-lg font-bold text-text-primary-users mt-1">
          {user.firstname} {user.lastname}
        </h3>
        <p className="text-sm text-text-secondary-users">@{user.username}</p>

        <div className="mt-3 pt-3 border-t border-border-primary-users text-sm text-text-secondary-users space-y-2">
          <div className="flex items-center justify-center sm:justify-start space-x-2">
            <MailIcon className="w-4 h-4" />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start space-x-2">
            <PhoneIcon className="w-4 h-4" />
            <span className="truncate">{user.phone}</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start space-x-2">
            <BuildingIcon className="w-4 h-4" />
            <span className="truncate">{user.branch}</span>
          </div>
        </div>
      </div>
      <div className="self-center sm:self-end">
        <a
          href={`/users/${user.id}/profile`}
          className="inline-block px-4 py-2 text-sm font-semibold text-white bg-accent-primary-users rounded-lg shadow-sm transition-colors hover:bg-accent-hover-users focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary-users focus:ring-offset-background-secondary-users"
        >
          Profile
        </a>
      </div>
    </div>
  );
};

/**
 * Reusable Modal Component
 */
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}> = ({ isOpen, onClose, children, title }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current === event.target) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-blue backdrop-blur-sm"
    >
      <div className="bg-background-secondary-users rounded-xl shadow-2xl w-full max-w-lg m-4 border border-border-primary-users">
        <header className="flex items-center justify-between p-5 border-b border-border-primary-users">
          <h2 className="text-xl font-bold text-text-primary-users">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-text-secondary-users hover:bg-background-accent-users"
            aria-label="Close modal"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </header>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

/**
 * AddUserForm Component with Photo Field
 */
const AddUserForm: React.FC<{
  onAddUser: (newUser: Omit<User, "id">) => void;
  onClose: () => void;
}> = ({ onAddUser, onClose }) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    phone: "",
    role: "",
    photo: "",
    branch: branchOptions[0],
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (
      Object.entries(formData).some(
        ([key, val]) => key !== "photo" && val === ""
      )
    ) {
      setError("All fields except photo are required.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const { confirmPassword, ...newUserPayload } = formData;
    onAddUser({
      ...newUserPayload,
      photo:
        formData.photo ||
        `https://placehold.co/128x128/a78bfa/ffffff?text=${formData.firstname.charAt(
          0
        )}${formData.lastname.charAt(0) || ""}`,
    });
    onClose();
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg bg-background-primary-users text-text-primary-users border border-border-primary-users focus:outline-none focus:ring-2 focus:ring-accent-primary-users";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="firstname"
          placeholder="First Name"
          onChange={handleChange}
          className={inputClass}
          required
        />
        <input
          type="text"
          name="lastname"
          placeholder="Last Name"
          onChange={handleChange}
          className={inputClass}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className={inputClass}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className={inputClass}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          className={inputClass}
          required
        />
        <input
          type="text"
          name="role"
          placeholder="Role (e.g., Developer)"
          onChange={handleChange}
          className={inputClass}
          required
        />
      </div>
      <input
        type="text"
        name="photo"
        placeholder="Photo URL (optional)"
        onChange={handleChange}
        className={inputClass}
      />
      <select
        name="branch"
        onChange={handleChange}
        className={inputClass}
        required
      >
        {branchOptions.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className={inputClass}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          className={inputClass}
          required
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex justify-end pt-4 space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 font-semibold text-text-secondary-users bg-background-accent-users rounded-lg hover:bg-border-primary-users"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 font-semibold text-white bg-accent-primary-users rounded-lg shadow-md hover:bg-accent-hover-users"
        >
          Create User
        </button>
      </div>
    </form>
  );
};

// ========= MAIN APP COMPONENT =========
const UserList = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddUser = (newUserPayload: Omit<User, "id">) => {
    const newUserWithId: User = { ...newUserPayload, id: Date.now() };
    setUsers((prevUsers) => [newUserWithId, ...prevUsers]);
  };

  return (
    <div className="min-h-screen bg-background-primary-users text-text-primary-users font-sans">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary-users">
            User Directory
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 font-semibold text-white bg-accent-primary-users rounded-lg shadow-sm hover:bg-accent-hover-users"
            >
              <UserPlusIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Add User</span>
            </button>
          </div>
        </header>

        <main>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </main>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create a New User"
      >
        <AddUserForm
          onAddUser={handleAddUser}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default UserList;


Backend:
end_point: apiClient.get(/accounts/users)
sample data:
[
    {
        "id": 1,
        "first_name": "Suhail",
        "last_name": "Sirat",
        "username": "suhail",
        "email": "suhailsammim1@gmail.com",
        "phone": "0788604823",
        "role": {
            "id": "1",
            "name": "admin",
            "display_name": "Administrator"
        },
        "avatar_url": "http://localhost:8000/media/suhail/users/suhail-6ba62a.png",
        "location": 1
    },
    {
        "id": 2,
        "first_name": "musawer",
        "last_name": "hashimi",
        "username": "musawer",
        "email": "musawer@gmail.com",
        "phone": null,
        "role": {
            "id": "3",
            "name": "manager",
            "display_name": "Manager"
        },
        "avatar_url": "https://placehold.co/256x256/E2E8F0/4A5568?text=mh",
        "location": 3
    },
    {
        "id": 3,
        "first_name": "Darwish",
        "last_name": "Raofi",
        "username": "darwish",
        "email": "darwish@gmail.com",
        "phone": null,
        "role": {
            "id": "5",
            "name": "cashier",
            "display_name": "Cashier"
        },
        "avatar_url": "http://localhost:8000/media/suhail/users/darwish-90c262.jpeg",
        "location": 3
    }
]

post: apiClient.post(/accounts/users/)
data format:


class CreateUserSerializer(serializers.ModelSerializer):
    """Serializer for creating new users (admin only)"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    role_id = serializers.CharField(write_only=True)
    location_id = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'username', 'email', 'photo', 'phone', 'password',
            'role_id', 'location_id',
        ]
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value
    
    def create(self, validated_data):
        role_id = validated_data.pop('role_id')
        location_id = validated_data.pop('location_id')
        password = validated_data.pop('password')
        
        # Get role and location
        try:
            role = UserRole.objects.get(id=role_id)
            if role.role_name == "admin":
                raise serializers.ValidationError("Cannot add an admin")
        except UserRole.DoesNotExist:
            raise serializers.ValidationError("Invalid role ID")
        
        try:
            location = Location.objects.get(id=location_id)
            if location.location_type != "store":
                raise Location.DoesNotExist
        except Location.DoesNotExist:
            raise serializers.ValidationError("Invalid location ID")
        
        # Create user
        user = User.objects.create_user(
            password=password,
            role=role,
            location=location,
            **validated_data
        )
        return user



HEY BRO i want you to connect the front end to the backend using axios instance (apiClient) and @tanstack/react-query
branch means the location
the location which is a number coming from backend you can use the useLocationStore(s => s.locations) coming from /stores/useLocationStore
whic i made
and find the location using the id (locations.find)
the location is object of format id: number;
  name: string;
  address: string;

 
if you have any question just ask.