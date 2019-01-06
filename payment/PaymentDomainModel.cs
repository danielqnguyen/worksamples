namespace Project.Models.Domain
{
    public class CreditCardModel
    {
        public int Amount { get; set; }
        public string Currency { get; set; }
        public string Description { get; set; }
        public string SourceId { get; set; }    
    }
}
