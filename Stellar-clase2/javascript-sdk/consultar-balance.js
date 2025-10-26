//IMPORTACIONES
import { Horizon } from "@stellar/stellar-sdk";

//CONFIGURACION
const server = new Horizon.Server("https://horizon-testnet.stellar.org");

//import { Server } from '@stellar/stellar-sdk';

//const server = new Server('https://horizon-testnet.stellar.org');
const PUBLIC_KEY = ['GCSJZNKKZ2RM3CYYTPPBFMJWLB2Y63RQBYHNSVGC2FR2F6BZE3WZFIBI', //celeste
                    'GC4KZEJQ6PJURXCSGBOXYPU4XUFEJ6D7HRKRBQ452N7KEPLKAKYBZYWE', //violeta
                    'GCI52VI5QTMVAGRKOGE7U42KVDM63LKAUBG3V7G3UQU5ZMK4FSWNWKQO'//rosa
                    ];

async function consultarBalance(publicKey,i) {
  try {
    console.log(`🔍 Consultando cuenta: ${publicKey.substring(0, 8)}...\n`);
    
    const account = await server.loadAccount(publicKey);
    
    console.log('╔═══════════════════════════════════╗');
    console.log('📊 INFORMACIÓN DE CUENTA');
    console.log('╚═══════════════════════════════════╝\n');
    
    console.log(`📧 Account ID:`);
    console.log(`   ${account.id}\n`);
    
    console.log(`🔢 Sequence Number:`);
    console.log(`   ${account.sequenceNumber()}\n`);
    
    console.log('╔═══════════════════════════════════╗');
    console.log('💰 BALANCES');
    console.log('╚═══════════════════════════════════╝\n');
    
    account.balances.forEach((balance, index) => {
      if (balance.asset_type === 'native') {
        console.log(`${i}. 🌟 XLM (Lumens):`);
        console.log(`   Total: ${balance.balance} XLM`);
        
        const baseReserve = 0.5;
        const subentryReserve = account.subentry_count * 0.5;
        const totalReserve = baseReserve + subentryReserve;
        const available = parseFloat(balance.balance) - totalReserve;
        
        console.log(`   Bloqueado: ${totalReserve.toFixed(7)} XLM`);
        console.log(`   Disponible: ${available.toFixed(7)} XLM\n`);
      } else {
        console.log(`${index + 1}. 🪙 ${balance.asset_code}:`);
        console.log(`   Balance: ${balance.balance}`);
        console.log(`   Emisor: ${balance.asset_issuer.substring(0, 8)}...\n`);
      }
    });
    
    return account;
    
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error('❌ Cuenta no encontrada');
      console.log('💡 Posibles causas:');
      console.log('   - La cuenta nunca fue creada/fondeada');
      console.log('   - Error de tipeo en la public key\n');
    } else {
      console.error('❌ Error:', error.message);
    }
    throw error;
  }
}

console.log('------------------- Consultando balances de cuentas -------------------');

for (let i = 0; i < PUBLIC_KEY.length; i++) {
    await consultarBalance(PUBLIC_KEY[i],i+1);
    console.log('-----------------------------------------------------');
}
