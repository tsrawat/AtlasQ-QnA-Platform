import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import {AppwriteException, ID, Models} from "appwrite"
import { account } from "@/models/client/config";


export interface UserPrefs {
  reputation: number
  avatarId?: string
  avatarVersion?: string
}

interface IAuthStore {
  session: Models.Session | null;
  jwt: string | null
  user: Models.User<UserPrefs> | null
  hydrated: boolean

  setHydrated(): void;
  verfiySession(): Promise<void>;
  refreshUser(): Promise<void>;
  login(
    email: string,
    password: string
  ): Promise<
  {
    success: boolean;
    error?: AppwriteException| null
  }>
  createAccount(
    name: string,
    email: string,
    password: string
  ): Promise<
  {
    success: boolean;
    error?: AppwriteException| null
  }>
  updateUser(user: Models.User<UserPrefs>): void
  logout(): Promise<void>
}


export const useAuthStore = create<IAuthStore>()(
  persist(
    immer((set) => ({
      session: null,
      jwt: null,
      user: null,
      hydrated: false,

      setHydrated() {
        set({hydrated: true})
      },

      async verfiySession() {
        try {
          const [session, user] = await Promise.all([
            account.getSession("current"),
            account.get<UserPrefs>(),
          ])
          set({session, user})

        } catch (error) {
          console.log(error)
        }
      },

      async refreshUser() {
        try {
          const user = await account.get<UserPrefs>()
          set({user})
        } catch (error) {
          set({session: null, jwt: null, user: null})
        }
      },

      async login(email: string, password: string) {
        try {
          const session = await account.createEmailPasswordSession(email, password)
          let [user, {jwt}] = await Promise.all([
            account.get<UserPrefs>(),
            account.createJWT()

          ])
          if (typeof user.prefs?.reputation !== "number") {
            await account.updatePrefs<UserPrefs>({ ...user.prefs, reputation: 0 })
            user = await account.get<UserPrefs>()
          }

          set({session, user, jwt})
          
          return { success: true}

        } catch (error) {

          console.log(error)
          return {
            success: false,
            error: error instanceof AppwriteException ? error: null,
            
          }
        }
      },

      async createAccount(name:string, email: string, password: string) {
        try {
          await account.create(ID.unique(), email, password, name)
          return {success: true}
        } catch (error) {
          console.log(error)
          return {
            success: false,
            error: error instanceof AppwriteException ? error: null,
            
          }
        }
      },

      updateUser(user: Models.User<UserPrefs>) {
        set({user})
      },

      async logout() {
        try {
          await account.deleteSessions()
          set({session: null, jwt: null, user: null})
          
        } catch (error) {
          console.log(error)
        }
      },
    })),
    {
      name: "auth",
      onRehydrateStorage(){
        return (state, error) => {
          if (!error) state?.setHydrated()
        }
      }
    }
  )
)
