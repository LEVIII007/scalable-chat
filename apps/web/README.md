/app
├── /components
│   ├── AuthForm.tsx                  # Login and Signup form component
│   ├── AuthHeader.tsx                # Header for the Auth page
│   ├── Navbar.tsx                    # Navbar for Home and Chat pages
│   ├── GroupList.tsx                 # Lists groups user has joined or can join
│   ├── GroupCard.tsx                 # Card for displaying each group info
│   ├── CreateOrJoinGroupPopup.tsx    # Popup to create or join groups
│   ├── ChatHeader.tsx                # Header in the chat displaying group info
│   ├── MessagesList.tsx              # Lists all messages in a group
│   ├── MessageBubble.tsx             # Individual message display
│   ├── MessageInput.tsx              # Input box for typing and sending messages
│   ├── NotificationPopup.tsx         # Popup for notifications (optional)
│   └── LoadingSpinner.tsx            # Loading indicator for async actions
├── /pages
│   ├── /api
│   │   ├── auth                      # Authentication API routes
│   │   ├── groups                    # Group-related API routes
│   │   └── messages                  # Message-related API routes
│   ├── login.tsx                     # Login page
│   ├── signup.tsx                    # Signup page
│   ├── home.tsx                      # Home page with GroupList
│   └── group
│       └── [groupId].tsx             # Group chat page
├── /hooks
│   ├── useAuth.ts                    # Custom hook for user authentication state
│   ├── useSocket.ts                  # Custom hook for WebSocket connection
│   └── useNotification.ts            # Hook for managing notifications
├── /context
│   └── AuthContext.tsx               # Context for managing auth state globally
├── /styles
│   ├── globals.css                   # Global styles
│   ├── auth.css                      # Styles specific to auth forms
│   ├── home.css                      # Styles specific to the home page
│   └── chat.css                      # Styles specific to the chat page
├── /utils
│   ├── api.ts                        # API utility functions
│   ├── formatDate.ts                 # Utility to format dates/timestamps
│   └── constants.ts                  # Constants like socket URLs or topic names
├── /lib
│   ├── prisma.ts                     # Prisma client setup
│   └── socket.ts                     # Socket.io client setup (if used)
├── .env                              # Environment variables
├── tsconfig.json                     # TypeScript configuration
└── next.config.js                    # Next.js configuration
