import escrowService from '../services/escrow.service';

export const startScheduler = () => {
    // Run every hour
    setInterval(async () => {
        console.log('⏰ Running auto-release scheduler...');
        await escrowService.autoReleaseExpiredOrders();
    }, 60 * 60 * 1000); // 1 hour

    console.log('✅ Scheduler started - checking for expired orders every hour');
};