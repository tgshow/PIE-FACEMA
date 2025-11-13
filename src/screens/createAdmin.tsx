import { supabase } from "../lib/supabase";

async function createAdmin() {
  const { data, error } = await supabase.auth.signUp({
    email: "admin@cidadeconectada.com",
    password: "admin321",
  });

  if (error) {
    console.error("Erro ao criar admin:", error);
  } else {
    console.log("✅ Admin criado com sucesso:", data.user);
  }
}

createAdmin();
