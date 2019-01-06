using System;
using System.IO;
using System.Threading.Tasks;
using System.Web;

using Project.Models.Requests;
using Project.Services.Interfaces;

using SendGrid;
using SendGrid.Helpers.Mail;

namespace Project.Services.Profile
{
    public class SendEmailService : ISendEmailService
    {
        public IConfigService _configService;
        public string sendGridKey { get; set; }

        public SendEmailService(IConfigService configService)
        {
            _configService = configService;
            sendGridKey = _configService.SelectByKey("sendgrid_api_key").ConfigValue;
        }

        public async Task<Response> SendEmail(RegisterInviteAddRequest model)
        {
            string dateInput = model.Expiration.ToString();
            DateTime parsedDate = DateTime.Parse(dateInput);
            var newDate = parsedDate.ToString();
            string serverPath = System.Configuration.ConfigurationManager.AppSettings["emailTemplate"];
            string rootPath = HttpContext.Current.Server.MapPath(serverPath);
            string serverFileName = "InviteEmailTemplate.html";
            string fqn = Path.Combine(rootPath, serverFileName);

            {
                var client = new SendGridClient(sendGridKey);
                var from = new EmailAddress("project@project.co", "project");
                var subject = "Invitation to Project";
                var to = new EmailAddress(model.Email, model.FirstName);
                string testTemplate = File.ReadAllText(fqn);
                string TemplateWithLink = testTemplate.Replace("{the_link}", "https://project.com/register/" + model.Token);
                var fullName = $"{model.FirstName} {model.LastName}";
                string TemplateWithFirstName = TemplateWithLink.Replace("{FirstName}", fullName);
                string TemplatewithExpiration = TemplateWithFirstName.Replace("{expired}", newDate);
                var plainTextContent = TemplatewithExpiration;
                var htmlContent = TemplatewithExpiration;
                var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
                Response response = await client.SendEmailAsync(msg);
                return response;
            }
        }
    }
}