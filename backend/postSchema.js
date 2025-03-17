import fs from 'fs';
import { SecretVaultWrapper } from 'nillion-sv-wrappers';
import { orgConfig } from './src/nillionOrgConfig.js';

// Read schema.json manually to avoid import issues
const schemaPath = new URL('./schema.json', import.meta.url);
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));

async function main() {
  try {
    console.log('🚀 Initializing SecretVaultWrapper...');
    
    const org = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials
    );
    await org.init();
    console.log('✅ SecretVaultWrapper initialized successfully.');

    const collectionName = 'Staking and Rewards Data';
    console.log(`📌 Creating schema for collection: "${collectionName}"...`);

    const newSchema = await org.createSchema(schema, collectionName);
    if (!newSchema || !newSchema.length) {
      throw new Error('Schema creation failed. No response from nodes.');
    }

    console.log('✅ New Collection Schema created for all nodes:', newSchema);
    console.log('👀 Schema ID:', newSchema[0]?.result?.data);

  } catch (error) {
    console.error('❌ Error using SecretVaultWrapper:', error);
    process.exit(1);
  }
}

main();
