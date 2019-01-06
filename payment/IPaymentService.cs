using Project.Models.Domain;


namespace Project.Services.Interfaces
{
    public interface ICreditCardService
    {
      void Payment (CreditCardModel model);
    }
}