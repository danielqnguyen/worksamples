using Project.Data;
using Project.Data.Providers;
using Project.Models.Domain;
using Project.Models.Requests;
using Project.Services.Interfaces;

using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace Project.Services.Profile
{
    public class RegisterInviteService : IRegisterInviteService
    {
        private IDataProvider _dataProvider;

        public RegisterInviteService(IDataProvider dataprovider)
        {
            _dataProvider = dataprovider;
        }

        public int Insert(RegisterInviteAddRequest model)
        {
            int id = 0;
            this._dataProvider.ExecuteNonQuery(
                "RegisterInvite_Insert",
                inputParamMapper: delegate (SqlParameterCollection paramList)
                {
                    SqlParameter param = new SqlParameter
                    {
                        ParameterName = "@Id",
                        SqlDbType = System.Data.SqlDbType.Int,
                        Direction = System.Data.ParameterDirection.Output
                    };
                    paramList.Add(param);
                    paramList.AddWithValue("@FirstName", model.FirstName);
                    paramList.AddWithValue("@MiddleInitial", model.MiddleInitial);
                    paramList.AddWithValue("@LastName", model.LastName);
                    paramList.AddWithValue("@Email", model.Email);
                    paramList.AddWithValue("@Token", model.Token);
                    paramList.AddWithValue("@Expiration", model.Expiration);
                    paramList.AddWithValue("@ModifiedBy", model.ModifiedBy);
                    paramList.AddWithValue("@RoleId", model.RoleId);
                    paramList.AddWithValue("@OrgId", model.OrgId);
                    paramList.AddWithValue("@FundSourceId", model.FundSourceId);
                },
                returnParameters: delegate (SqlParameterCollection paramList)
                {
                    id = (int)paramList["@Id"].Value;
                });
            return id;
        }

        public RegisterInviteDomainModel SelectById(int id)
        {
            RegisterInviteDomainModel model = new RegisterInviteDomainModel();
            this._dataProvider.ExecuteCmd(
                "RegisterInvite_SelectById",
                inputParamMapper: delegate (SqlParameterCollection paramList)
                {
                    paramList.AddWithValue("@Id", id);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int index = 0;
                    model = MapRegisterInvite(reader, index);
                });
            return model;
        }

        public RegisterInviteDomainModel SelectByEmail(string email)
        {
            RegisterInviteDomainModel model = new RegisterInviteDomainModel();
            this._dataProvider.ExecuteCmd(
                "RegisterInvite_Role",
                inputParamMapper: delegate (SqlParameterCollection paramList)
                {
                    paramList.AddWithValue("@Email", email);
                },
              singleRecordMapper: delegate (IDataReader reader, short set)
              {
                  int index = 0;
                  model = MapRoleRegisterInvite(reader, index);
              });
            return model;

        }

        public List<RegisterInviteDomainModel> SelectAll()
        {
            List<RegisterInviteDomainModel> result = new List<RegisterInviteDomainModel>();
            this._dataProvider.ExecuteCmd(
                "RegisterInvite_SelectAll",
                inputParamMapper: null,
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    RegisterInviteDomainModel model = new RegisterInviteDomainModel();
                    int index = 0;
                    model = MapRegisterInvite(reader, index);
                    index++;
                    result.Add(model);
                });
            return result;
        }

        public List<RegisterInviteDomainModel> SelectAllP(int pageNumber, int rowsToDisplay)
        {
            List<RegisterInviteDomainModel> result = new List<RegisterInviteDomainModel>();
            this._dataProvider.ExecuteCmd(
                "RegisterInvite_SelectByPage",
                inputParamMapper: delegate (SqlParameterCollection paramList)
                {
                    SqlParameter param = new SqlParameter
                    {
                        ParameterName = "@Id",
                        SqlDbType = SqlDbType.Int,
                        Direction = ParameterDirection.Output
                    };
                    paramList.AddWithValue("@PageNumber", pageNumber);
                    paramList.AddWithValue("@rowsToDisplay", rowsToDisplay);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    RegisterInviteDomainModel model = new RegisterInviteDomainModel();
                    int index = 0;
                    model = MapRegisterInvite(reader, index);
                    index++;
                    result.Add(model);
                });
            return result;
        }


        public static RegisterInviteDomainModel MapRegisterInvite(IDataReader reader, int index)
        {
            RegisterInviteDomainModel model = new RegisterInviteDomainModel();
            model.Id = reader.GetSafeInt32(index++);
            model.FirstName = reader.GetSafeString(index++);
            model.MiddleInitial = reader.GetSafeString(index++);
            model.LastName = reader.GetSafeString(index++);
            model.Email = reader.GetSafeString(index++);
            model.Token = reader.GetSafeString(index++);
            model.Expiration = reader.GetSafeDateTime(index++);
            model.CreatedDate = reader.GetSafeDateTime(index++);
            model.ModifiedDate = reader.GetSafeDateTime(index++);
            model.ModifiedBy = reader.GetSafeString(index++);
            return model;
        }
        
        public static RegisterInviteDomainModel MapRoleRegisterInvite(IDataReader reader, int index)
        {
            RegisterInviteDomainModel model = new RegisterInviteDomainModel();
            model.Id = reader.GetSafeInt32(index++);
            model.RoleId = reader.GetSafeInt32(index++);
            model.OrgId = reader.GetSafeInt32(index++);
            model.FundSourceId = reader.GetSafeInt32(index++);
            model.FirstName = reader.GetSafeString(index++);
            model.MiddleInitial = reader.GetSafeString(index++);
            model.LastName = reader.GetSafeString(index++);
            model.Email = reader.GetSafeString(index++);
            model.Token = reader.GetSafeString(index++);
            model.Expiration = reader.GetSafeDateTime(index++);
            model.CreatedDate = reader.GetSafeDateTime(index++);
            model.ModifiedDate = reader.GetSafeDateTime(index++);
            model.ModifiedBy = reader.GetSafeString(index++);
            return model;
        }

        public int Update(RegisterInviteUpdateRequest model)
        {
            var ID = 0;
            this._dataProvider.ExecuteNonQuery(
                "RegisterInvite_Update",
                inputParamMapper: delegate (SqlParameterCollection paramList)
                {
                    paramList.AddWithValue("@Id", model.Id);
                    paramList.AddWithValue("@FirstName", model.FirstName);
                    paramList.AddWithValue("@MiddleInitial", model.MiddleInitial);
                    paramList.AddWithValue("@LastName", model.LastName);
                    paramList.AddWithValue("@Email", model.Email);
                    paramList.AddWithValue("@Expiration", model.Expiration);
                    paramList.AddWithValue("@ModifiedBy", model.ModifiedBy);
                },
                returnParameters: (SqlParameterCollection paramList) =>
                {
                    ID = (int)paramList["@ID"].Value;
                }
                );
            return ID;
        }

        public void Delete(int id)
        {
            this._dataProvider.ExecuteNonQuery(
                "RegisterInvite_Delete",
                inputParamMapper: delegate (SqlParameterCollection paramList)
                {
                    paramList.AddWithValue("@Id", id);
                });
        }
    }
}