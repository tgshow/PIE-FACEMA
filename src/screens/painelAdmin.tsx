import { useEffect, useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { supabase } from "../lib/supabase";

export default function PainelAdmin() {
  const [denuncias, setDenuncias] = useState<any[]>([]);

  useEffect(() => {
    buscarDenuncias();
  }, []);

  async function buscarDenuncias() {
    const { data, error } = await supabase.from("denuncias").select("*").order("created_at", { ascending: false });
    if (error) console.error(error);
    else setDenuncias(data);
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Painel de Denúncias</Text>
      {denuncias.map((item) => (
        <View key={item.id} style={{ marginBottom: 20, borderBottomWidth: 1, paddingBottom: 10 }}>
          {item.foto_url && (
            <Image
              source={{ uri: item.foto_url }}
              style={{ width: "100%", height: 200, borderRadius: 8 }}
            />
          )}
          <Text style={{ fontWeight: "bold", marginTop: 5 }}>{item.descricao}</Text>
          <Text>📍 {item.latitude}, {item.longitude}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
