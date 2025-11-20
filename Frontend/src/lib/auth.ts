// import { supabase, Profile } from './supabase';

import { apolloClient } from "./apllo";
import { GET_WRITER, LOGINORSIGNUP, UPDATEWRITER } from "./operations";
import { Writer } from "./types";

const STORAGE_KEY = "inkspire_current_writer";
const authEventTarget = new EventTarget();

function emitEvent(payload: Writer | null){
  authEventTarget.dispatchEvent(new CustomEvent("authChange", {detail: payload}));

  try{
    localStorage.setItem("__inkspire_auth_signal", String(Date.now()));
  }catch (e) {}
}


export const authService = {
  async logInOrSignUpWriter(input: { email: string, password: string, name: string | any, bio: string | any }) {
    const result = await apolloClient.mutate<
      { logInOrSignUpWriter: Writer },
      { input: { email: string; password: string; name: string; bio: string } }
    >({
      mutation: LOGINORSIGNUP,
      variables: { input },
    });

    if (result.error) {
      throw new Error('Failed to create user');
    }

    const writer: Writer | undefined = result.data?.logInOrSignUpWriter;
    if (!writer) {
      throw new Error('Failed to create user');
    }

    localStorage.setItem("userId", writer.id.toString());
    localStorage.setItem("userName", writer.name);

    return { user: writer, profile: writer };
  },

  /* async signIn(email: string, password: string) {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      throw authError || new Error('Invalid email or password');
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', authData.user.id)
      .maybeSingle();

    if (profileError) {
      throw profileError;
    }

    return { user: authData.user, profile };
  },*/


  /*   async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
    }, */

  /*   async getCurrentProfile(): Promise<Profile | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();
    
    if (error) throw error;
    return data;
    }, */

  async signOut() {
    localStorage.clear();
  },

  async getProfileById(profileId: string): Promise<Writer | null> {
    const result = await apolloClient.query<
      { getWriterById: Writer | null },
      { id: string }
    >({
      query: GET_WRITER,
      variables: { id: profileId },
      fetchPolicy: "network-only",
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data?.getWriterById ?? null;
  },

  async updateProfile(input: { id: string, name: string, bio: string, avatarUrl: string }) {
    const result = await apolloClient.mutate<
      { updateWriter: Writer | null },
      { id: string; input: { id: string, name: string, bio: string, avatarUrl: string } }
    >({
      mutation: UPDATEWRITER,
      variables: { id: input.id, input },
    });
    return result.data?.updateWriter;
  },

  /*   async updateProfile(profileId: string, updates: Partial<Profile>) {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profileId)
        .select()
        .single();
  
      if (error) throw error;
      return data;
    }, */

    onAuthStateChange(callback: (user: Writer | null) => void) {
      const handler = (ev: Event) => {
        const details = (ev as CustomEvent).detail as Writer | null;
        callback(details);
      };
      authEventTarget.addEventListener("authChange", handler as EventListener);

          const storageHandler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        const newVal = e.newValue ? JSON.parse(e.newValue) as Writer : null;
        callback(newVal);
      }
      // also listen to the special signal key that we toggle to notify tabs
      if (e.key === "__inkspire_auth_signal") {
        // read the actual writer from STORAGE_KEY
        const newVal = localStorage.getItem(STORAGE_KEY);
        callback(newVal ? JSON.parse(newVal) as Writer : null);
      }
    };
    window.addEventListener("storage", storageHandler);

    // Return unsubscribe function
    return () => {
      authEventTarget.removeEventListener("authChange", handler as EventListener);
      window.removeEventListener("storage", storageHandler);
    };      
  }
};
