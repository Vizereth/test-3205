import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const port = 8080;

app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000", 
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
}));

app.get("/", (req, res) => {
  res.send("Server running...");
});

type UserType = { [key: string]: { email: string; number: string } };
type UsersType = Array<UserType>;

type CurrentRequest = {
  promise: Promise<void>;
  cancel: () => void;
};

let currentRequest: CurrentRequest | null = null;

app.post("/submitForm", async (req, res) => {
  if (currentRequest) {
    currentRequest.cancel();
  }

  const delay = new Promise((resolve) => setTimeout(resolve, 5000));

  const requestPromise = delay.then(async () => {
    const searchQuery = req.body;
    const users = await searchUsers(searchQuery);

    res.json(users);
  });

  currentRequest = {
    promise: requestPromise,
    cancel: () => res.sendStatus(400),
  };

  try {
    await requestPromise;
  } finally {
    currentRequest = null;
  }
});

const filterUsers = (users: UsersType, searchQuery: UserType): UserType[] => {
  return users.filter((user) => {
    return Object.entries(searchQuery).every(([key, value]) => {
      return !value || user[key] === value;
    });
  });
};

async function searchUsers(searchQuery: UserType): Promise<UserType[]> {
  try {
    const usersData = await fs.promises.readFile("./src/data/users.json", "utf-8");
    const users: UserType[] = await JSON.parse(usersData);

    return filterUsers(users, searchQuery);
  } catch (error) {
    console.error("Error fetching users", error);
    return [];
  }
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
