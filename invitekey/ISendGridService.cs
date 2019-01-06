using System.Threading.Tasks;

using Project.Models.Requests;

using SendGrid;

namespace Project.Services.Interfaces
{
    public interface ISendEmailService
    {
        Task<Response> SendEmail(RegisterInviteAddRequest model);
    }
}
