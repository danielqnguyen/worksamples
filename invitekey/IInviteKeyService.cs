using Project.Models.Domain;
using Project.Models.Requests;

using System.Collections.Generic;

namespace Project.Services.Interfaces
{
    public interface IRegisterInviteService
    {
        int Insert(RegisterInviteAddRequest model);
        void Delete(int id);
        List<RegisterInviteDomainModel> SelectAll();
        List<RegisterInviteDomainModel> SelectAllP(int pageNumber, int rowsToDisplay);
        RegisterInviteDomainModel SelectById(int id);
        int Update(RegisterInviteUpdateRequest model);
        RegisterInviteDomainModel SelectByToken(string Token);
        RegisterInviteDomainModel SelectByEmail(string email);
    }
}
