// import { supabase, Profile } from './supabase';

import { apolloClient } from "./apllo";
import { GET_WRITER, LOGINORSIGNUP } from "./operations";
import { Writer } from "./types";


export const authService = {
  async logInOrSignUpWriter(input : {email: string, password: string, name: string, bio: string}) {
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
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, */

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

/*   onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
  }, */
};
