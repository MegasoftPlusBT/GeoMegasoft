using HASELT.GeoMega.AppServices;

namespace HASELT.GeoMega.Framework
{
    public class BootstrapperSettings : IBootstrapperConfiguration
    {
        public virtual string Database_Main_ConnectionString => AppSettingsHelper.GetConfigValueAsString("Database_Main_ConnectionString");
        public virtual ApplicationTypeEnum ApplicationType => AppSettingsHelper.GetConfigValueAsEnum<ApplicationTypeEnum>("ApplicationType");

        public virtual SmtpDeliveryMethodEnum Smtp_DeliveryMethod => AppSettingsHelper.GetConfigValueAsEnum<SmtpDeliveryMethodEnum>("Smtp_DeliveryMethod");
        public virtual bool Smtp_EnableSsl => AppSettingsHelper.GetConfigValueAsBool("Smtp_EnableSsl");
        public virtual string Smtp_From => AppSettingsHelper.GetConfigValueAsString("Smtp_From");
        public virtual string Smtp_Host => AppSettingsHelper.GetConfigValueAsString("Smtp_Host");
        public virtual string Smtp_Password => AppSettingsHelper.GetConfigValueAsString("Smtp_Password");
        public virtual string Smtp_PickupDirectoryLocation => AppSettingsHelper.GetConfigValueAsString("Smtp_PickupDirectoryLocation");
        public virtual bool Smtp_UseDefaultCredentials => AppSettingsHelper.GetConfigValueAsBool("Smtp_UseDefaultCredentials");
        public virtual int Smtp_Port => AppSettingsHelper.GetConfigValueAsInt("Smtp_Port");
        public virtual string Smtp_Username => AppSettingsHelper.GetConfigValueAsString("Smtp_Username");

        public virtual string Storage_BaseUrl => AppSettingsHelper.GetConfigValueAsString("Storage_BaseUrl");
        public virtual string Storage_RootPath => AppSettingsHelper.GetConfigValueAsString("Storage_RootPath");

        public virtual string Email_Account_Name => AppSettingsHelper.GetConfigValueAsString("Email_Account_Name");
    }
}
