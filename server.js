import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js'

const main = async () => {
  try {
    await mongoose.connect(MONGO_URL + 'mad_joke');
    app.listen(PORT, () => {
      console.log("App is listening on 3000");
    });
  } catch (error) {
    console.error(err);
    process.exit(1);
  }
};

main();