import crypto from 'crypto';
import moment from 'moment';

export interface VNPayParams {
    amount: number;
    orderInfo: string;
    orderId: string;
    returnUrl: string;
    ipAddr: string;
}

export class VNPayService {
    private getTmnCode(): string {
        return process.env.VNPAY_TMN_CODE || '';
    }

    private getHashSecret(): string {
        return process.env.VNPAY_HASH_SECRET || '';
    }

    private getUrl(): string {
        return process.env.VNPAY_URL || '';
    }

    /**
     * Tạo URL thanh toán VNPay
     */
    createPaymentUrl(params: VNPayParams): string {
        const tmnCode = this.getTmnCode();
        const hashSecret = this.getHashSecret();
        const url = this.getUrl();

        console.log('🔐 VNPay Config Check:');
        console.log('TMN Code:', tmnCode || 'MISSING ❌');
        console.log('Hash Secret:', hashSecret ? '***' + hashSecret.slice(-4) : 'MISSING ❌');
        console.log('URL:', url);

        if (!tmnCode || !hashSecret) {
            throw new Error('VNPay credentials not configured');
        }

        const date = new Date();
        const createDate = moment(date).format('YYYYMMDDHHmmss');

        let vnp_Params: Record<string, string> = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: tmnCode,
            vnp_Locale: 'vn',
            vnp_CurrCode: 'VND',
            vnp_TxnRef: params.orderId,
            vnp_OrderInfo: params.orderInfo,
            vnp_OrderType: 'other',
            vnp_Amount: String(params.amount * 100),
            vnp_ReturnUrl: params.returnUrl,
            vnp_IpAddr: params.ipAddr,
            vnp_CreateDate: createDate
        };

        // Sort params alphabetically
        vnp_Params = this.sortObject(vnp_Params);

        // Create query string
        const sortedKeys = Object.keys(vnp_Params).sort();
        const signData = sortedKeys
            .map(key => `${key}=${encodeURIComponent(vnp_Params[key])}`)
            .join('&');

        // Create signature
        const hmac = crypto.createHmac('sha512', hashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        // Build final URL
        const paymentUrl = `${url}?${signData}&vnp_SecureHash=${signed}`;

        console.log('💳 Payment URL generated successfully');

        return paymentUrl;
    }

    /**
     * Verify callback từ VNPay
     */
    verifyReturnUrl(vnp_Params: any): { isValid: boolean; message: string } {
        const hashSecret = this.getHashSecret();

        if (!hashSecret) {
            throw new Error('VNPay hash secret not configured');
        }

        const secureHash = vnp_Params['vnp_SecureHash'];

        // Create a copy and remove hash fields
        const signData = { ...vnp_Params };
        delete signData['vnp_SecureHash'];
        delete signData['vnp_SecureHashType'];

        // Sort and create signature
        const sortedKeys = Object.keys(signData).sort();
        const dataStr = sortedKeys
            .map(key => `${key}=${signData[key]}`)
            .join('&');

        const hmac = crypto.createHmac('sha512', hashSecret);
        const signed = hmac.update(Buffer.from(dataStr, 'utf-8')).digest('hex');

        console.log('🔐 Verifying signature...');
        console.log('Expected:', signed);
        console.log('Received:', secureHash);

        if (secureHash === signed) {
            if (vnp_Params['vnp_ResponseCode'] === '00') {
                return { isValid: true, message: 'Success' };
            } else {
                return {
                    isValid: false,
                    message: `Payment failed with code: ${vnp_Params['vnp_ResponseCode']}`
                };
            }
        } else {
            return { isValid: false, message: 'Invalid signature' };
        }
    }

    /**
     * Sort object keys alphabetically
     */
    private sortObject(obj: Record<string, string>): Record<string, string> {
        const sorted: Record<string, string> = {};
        const keys = Object.keys(obj).sort();

        keys.forEach(key => {
            sorted[key] = obj[key];
        });

        return sorted;
    }
}

export default new VNPayService();