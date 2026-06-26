import cron from 'node-cron';
import { processDailyROI } from './businessLogicService.js';

/**
 * Initializes all cron jobs for the application.
 * Cron expression '0 0 * * *' means: run at 0 minutes, 0 hours (12:00 AM) every day.
 */
export const startCronJobs = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log(`[CRON] Starting Daily ROI processing at ${new Date().toISOString()}`);
    
    try {
      // Execute the business logic from Task 3
      const result = await processDailyROI();
      
      console.log(
        `[CRON] Daily ROI processing completed successfully. ` +
        `Processed: ${result.processedCount} | Skipped (Idempotent): ${result.skippedCount}`
      );
    } catch (error) {
      console.error('[CRON] Critical Error during Daily ROI processing:', error.message);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata" // Sets the timezone to match the Kolkata-based business requirement
  });

  console.log('[CRON] Daily ROI Scheduler initialized successfully.');
};