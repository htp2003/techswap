import { Shield, Lock, FileText, AlertCircle, Users, CreditCard } from 'lucide-react'

export default function Policy() {
    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary/10 via-purple-50 to-blue-50 dark:from-primary/20 dark:via-purple-950 dark:to-blue-950 py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                        <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy & Policies</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Your trust and safety are our top priorities. Learn about our policies and how we protect you.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-5xl">
                <div className="space-y-8">
                    {/* Privacy Policy */}
                    <section className="bg-card border border-border rounded-lg p-8">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Lock className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Privacy Policy</h2>
                                <p className="text-sm text-muted-foreground">Last updated: October 16, 2025</p>
                            </div>
                        </div>

                        <div className="space-y-6 text-muted-foreground">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">Information We Collect</h3>
                                <ul className="space-y-2 list-disc list-inside">
                                    <li>Personal information (name, email, phone number) when you register</li>
                                    <li>Product listings and transaction history</li>
                                    <li>Payment information (processed securely through our payment partners)</li>
                                    <li>Device and usage data to improve our services</li>
                                    <li>Communication data between buyers and sellers</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">How We Use Your Information</h3>
                                <ul className="space-y-2 list-disc list-inside">
                                    <li>To facilitate transactions between buyers and sellers</li>
                                    <li>To provide customer support and resolve disputes</li>
                                    <li>To send important updates about your transactions</li>
                                    <li>To improve our platform and user experience</li>
                                    <li>To prevent fraud and maintain platform security</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">Data Security</h3>
                                <p>
                                    We implement industry-standard security measures to protect your data. All sensitive
                                    information is encrypted in transit and at rest. Payment information is handled by
                                    PCI-compliant payment processors and never stored on our servers.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">Your Rights</h3>
                                <ul className="space-y-2 list-disc list-inside">
                                    <li>Access your personal data at any time</li>
                                    <li>Request correction of inaccurate information</li>
                                    <li>Delete your account and associated data</li>
                                    <li>Export your data in a portable format</li>
                                    <li>Opt-out of marketing communications</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Terms of Service */}
                    <section className="bg-card border border-border rounded-lg p-8">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Terms of Service</h2>
                                <p className="text-sm text-muted-foreground">Effective: October 16, 2025</p>
                            </div>
                        </div>

                        <div className="space-y-6 text-muted-foreground">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">Seller Responsibilities</h3>
                                <ul className="space-y-2 list-disc list-inside">
                                    <li>Provide accurate descriptions and photos of products</li>
                                    <li>Only list items you legally own and can sell</li>
                                    <li>Ship items within 3 business days of payment</li>
                                    <li>Respond to buyer inquiries within 24 hours</li>
                                    <li>Package items securely to prevent damage during shipping</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">Buyer Responsibilities</h3>
                                <ul className="space-y-2 list-disc list-inside">
                                    <li>Review product details carefully before purchasing</li>
                                    <li>Complete payment within 24 hours of order placement</li>
                                    <li>Confirm receipt within 3 days of delivery</li>
                                    <li>Report any issues within 48 hours of receiving the item</li>
                                    <li>Treat sellers with respect and professionalism</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">Prohibited Items</h3>
                                <p className="mb-2">The following items are strictly prohibited on TechSwap:</p>
                                <ul className="space-y-2 list-disc list-inside">
                                    <li>Stolen or counterfeit products</li>
                                    <li>Items with removed or altered serial numbers</li>
                                    <li>Damaged items not disclosed in the listing</li>
                                    <li>Items that violate intellectual property rights</li>
                                    <li>Hazardous or illegal materials</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">Account Termination</h3>
                                <p>
                                    We reserve the right to suspend or terminate accounts that violate our terms,
                                    engage in fraudulent activity, or receive multiple buyer complaints. Users may
                                    appeal terminations by contacting support.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Escrow & Payment */}
                    <section className="bg-card border border-border rounded-lg p-8">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <CreditCard className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Escrow Protection</h2>
                                <p className="text-sm text-muted-foreground">How we keep your money safe</p>
                            </div>
                        </div>

                        <div className="space-y-6 text-muted-foreground">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">How It Works</h3>
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-bold text-primary">1</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Buyer Places Order</p>
                                            <p className="text-sm">Payment is held securely in escrow</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-bold text-primary">2</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Seller Ships Item</p>
                                            <p className="text-sm">Tracking number is provided to buyer</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-bold text-primary">3</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Buyer Receives & Confirms</p>
                                            <p className="text-sm">Inspection period of 3 days</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-bold text-primary">4</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Payment Released</p>
                                            <p className="text-sm">Seller receives funds after confirmation</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">Buyer Protection</h3>
                                <ul className="space-y-2 list-disc list-inside">
                                    <li>Full refund if item is not as described</li>
                                    <li>Protection against fraud and scams</li>
                                    <li>3-day inspection period after delivery</li>
                                    <li>Dispute resolution support</li>
                                    <li>Money-back guarantee for eligible cases</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">Seller Protection</h3>
                                <ul className="space-y-2 list-disc list-inside">
                                    <li>Payment guaranteed after buyer confirmation</li>
                                    <li>Protection against payment fraud</li>
                                    <li>Support for shipping disputes</li>
                                    <li>Tracking requirement protects against false claims</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Dispute Resolution */}
                    <section className="bg-card border border-border rounded-lg p-8">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Dispute Resolution</h2>
                                <p className="text-sm text-muted-foreground">Fair and transparent process</p>
                            </div>
                        </div>

                        <div className="space-y-6 text-muted-foreground">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">Filing a Dispute</h3>
                                <p className="mb-3">
                                    If you encounter an issue with a transaction, you can file a dispute within 48 hours
                                    of receiving the item. Our support team will review all evidence and make a fair decision.
                                </p>
                                <ul className="space-y-2 list-disc list-inside">
                                    <li>Provide photos and detailed description of the issue</li>
                                    <li>Include all relevant communication with the other party</li>
                                    <li>Submit any additional evidence (receipts, shipping info, etc.)</li>
                                    <li>Response from support team within 24-48 hours</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">Valid Dispute Reasons</h3>
                                <ul className="space-y-2 list-disc list-inside">
                                    <li>Item significantly different from description</li>
                                    <li>Item arrived damaged or defective</li>
                                    <li>Missing accessories or parts mentioned in listing</li>
                                    <li>Item is counterfeit or not authentic</li>
                                    <li>Seller failed to ship within agreed timeframe</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Contact */}
                    <section className="bg-gradient-to-r from-primary/10 to-purple-100/50 dark:from-primary/20 dark:to-purple-950/30 border border-primary/20 rounded-lg p-8 text-center">
                        <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Questions About Our Policies?</h3>
                        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                            Our support team is here to help. Contact us anytime if you have questions or concerns.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="mailto:support@techswap.com"
                                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                            >
                                Email Support
                            </a>
                            <a
                                href="/help"
                                className="inline-flex items-center justify-center px-6 py-3 bg-card border border-border rounded-lg hover:bg-muted transition-colors font-medium"
                            >
                                Help Center
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
