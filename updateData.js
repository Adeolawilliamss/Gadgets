const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Store = require('./server/models/storeModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => console.log('✅ DB connection successful!'))
  .catch((err) => console.error('❌ DB connection error:', err));

const updateData = async () => {
  try {
    const stores = await Store.find();
    const updates = {
      'computers collection': 'Computers',
      'tv collection': 'TV',
      'speakers collection': 'Speakers',
      'cellphones collection': 'Cell Phones',
      'gaming collection': 'Gaming',
    };

    let updated = 0;
    for (const store of stores) {
      const fixed = updates[store.collection.toLowerCase()];
      if (fixed && store.collection !== fixed) {
        store.collection = fixed;
        await store.save();
        console.log(`✅ Updated: ${store._id} => ${fixed}`);
        updated++;
      }
    }

    console.log(`\n✅ Finished. ${updated} store entries updated.`);
    process.exit();
  } catch (err) {
    console.error('❌ Error updating store collection names:', err);
    process.exit(1);
  }
};

updateData();
