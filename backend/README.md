```
backend/
├── config/              # Configuration files
│   └── db.js            # Database connection
├── controllers/         # Request handlers
│   └── index.js         # Controller logic
├── models/              # Data models
│   └── index.js         # Database schemas
├── routes/              # API routes
│   └── index.js         # Route definitions
├── utils/               # Helper functions
│   └── index.js         # Utility functions
├── tests/               # Unit/integration tests
├── .env                 # Environment variables (gitignored)
├── package.json         # Dependencies
└── index.js             # Entry point
```


## Endpoints

1. register a user
2. sign a user
3. crud matrix operation in history


## tasks
- [ ] create all migration tables
- [ ] rewrite models to use knex class and its methods
- [ ] delete a postgres table and test both envs using postman
- [ ] modify tests and leave only useful and runnable ones