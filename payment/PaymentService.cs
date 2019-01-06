using Project.Models.Domain;
using Project.Services.Interfaces;

using Stripe;

namespace Project.Services.Payment
{
    public class PaymentService : IPaymentService
    {
        public IConfigService _configService;
        public string stripeApiKey { get; set; }

        public PaymentService(IConfigService configService)
        {
            _configService = configService;
            stripeApiKey = _configService.SelectByKey("stripe_api_key_sk").ConfigValue;
        }

        public void Payment(PaymentModel model)
        {
            StripeConfiguration.SetApiKey(stripeApiKey);

            var options = new ChargeCreateOptions
            {
                Amount = model.Amount,
                Currency = model.Currency,
                Description = model.Description,
                SourceId = model.SourceId // obtained with Stripe.js,
            };
            var service = new ChargeService();
            Charge charge = service.Create(options);
        }
    }
}
