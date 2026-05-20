const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.local' });
const token = process.env.SUPABASE_ACCESS_TOKEN;
const projectRef = process.env.SUPABASE_PROJECT_REF || 'xreynxwneucnmgbmiegu';

async function getKeys() {
  try {
    console.log('Buscando as chaves de API do novo projeto no Supabase...');
    const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/api-keys`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Erro ao buscar chaves:', data);
      return;
    }

    console.log('Chaves encontradas com sucesso!');
    
    // O retorno pode ser um array de chaves. Vamos procurar a chave anon/publishable
    let newAnonKey = null;
    let serviceRoleKey = null;

    if (Array.isArray(data)) {
      // Formato array
      const anonItem = data.find(k => k.name === 'anon' || k.tags?.includes('anon') || k.api_key?.startsWith('sb_publishable_') || k.api_key_map?.publishable);
      if (anonItem) {
        newAnonKey = anonItem.api_key || anonItem.api_key_map?.publishable;
      }
      
      const serviceItem = data.find(k => k.name === 'service_role' || k.api_key_map?.secret);
      if (serviceItem) {
        serviceRoleKey = serviceItem.api_key || serviceItem.api_key_map?.secret;
      }
    } else if (data.api_key_map) {
      // Formato objeto direto
      newAnonKey = data.api_key_map.publishable;
      serviceRoleKey = data.api_key_map.secret;
    }

    // Fallback: se não achar pelo mapeamento direto, vamos printar tudo para ver o formato
    if (!newAnonKey) {
      console.log('Dados recebidos da API:', JSON.stringify(data, null, 2));
      // Tentar varrer propriedades comuns
      for (const item of data) {
        if (item.api_key && (item.api_key.startsWith('sb_publishable_') || item.name === 'anon')) {
          newAnonKey = item.api_key;
        }
        if (item.api_key && item.name === 'service_role') {
          serviceRoleKey = item.api_key;
        }
      }
    }

    if (newAnonKey) {
      console.log('Nova Anon/Publishable Key encontrada:', newAnonKey.substring(0, 20) + '...');
      
      // Atualizar o arquivo .env.local
      const envPath = path.join(__dirname, '..', '.env.local');
      let envContent = fs.readFileSync(envPath, 'utf8');

      // Substituir a chave antiga pela nova
      const regex = /NEXT_PUBLIC_SUPABASE_ANON_KEY=.*/;
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `NEXT_PUBLIC_SUPABASE_ANON_KEY=${newAnonKey}`);
        fs.writeFileSync(envPath, envContent, 'utf8');
        console.log('Arquivo .env.local atualizado com a nova chave anon!');
      } else {
        console.warn('Variável NEXT_PUBLIC_SUPABASE_ANON_KEY não encontrada no .env.local.');
      }
    } else {
      console.error('Não foi possível identificar a anon_key na resposta da API.');
    }

  } catch (err) {
    console.error('Erro na requisição das chaves:', err);
  }
}

getKeys();
