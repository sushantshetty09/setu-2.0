import readline from 'readline';
import { ConversationFlow } from './chatbot/conversationFlow';
import { InMemoryConversationStore } from './chatbot/conversationManager';
import { defaultSchemeService } from './services/schemeService';

// Initialize a dedicated simulator instance
const store = new InMemoryConversationStore();
const flow = new ConversationFlow(store, defaultSchemeService);
const SIMULATED_USER_ID = 'simulated_citizen_919876543210';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.clear();
console.log('╔═══════════════════════════════════════════════════════════════════╗');
console.log('║       🇮🇳  SCHEME SAATHI — LOCAL WHATSAPP CHATBOT SIMULATOR       ║');
console.log('╠═══════════════════════════════════════════════════════════════════╣');
console.log('║  Simulate real WhatsApp chats locally without Meta credentials!  ║');
console.log('║                                                                   ║');
console.log('║  • Type HI, START, or नमस्ते to begin                             ║');
console.log('║  • Special commands: BACK, RESTART, STOP, HELP                    ║');
console.log('║  • Type "exit" or press Ctrl+C to quit                            ║');
console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

function printBotMessages(messages: string[]) {
  for (const msg of messages) {
    console.log('\n💬 [Scheme Saathi 🤖]:');
    console.log('----------------------------------------------------');
    console.log(msg);
    console.log('----------------------------------------------------');
  }
}

async function promptUser() {
  rl.question('\n👤 You: ', async (input) => {
    const trimmed = input.trim();

    if (trimmed.toLowerCase() === 'exit' || trimmed.toLowerCase() === 'quit') {
      console.log('\n👋 Exiting Scheme Saathi Simulator. Dhanyavaad!\n');
      rl.close();
      process.exit(0);
    }

    if (!trimmed) {
      promptUser();
      return;
    }

    try {
      const replies = await flow.handleMessage(SIMULATED_USER_ID, trimmed);
      printBotMessages(replies);
    } catch (err: any) {
      console.error('\n❌ Simulator Error:', err.message || err);
    }

    promptUser();
  });
}

// Kick off with initial prompt
promptUser();
