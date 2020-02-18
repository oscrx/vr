var config = {};
// Change properties below this line

// The IP or URL for your netbox installation
config.netbox_uri = "https://netbox.local.mybit.nl";

// Authorization token for netbox user
config.netbox_token = "123456789abcdefg123456789abcdefg";

// Outbound SMTP Server
config.smtp_server = "mybit-smtp01.local.mybit.nl";
config.smtp_port = 25;
config.smtp_secure = false;
config.smtp_tls_rejectUnauthorized = false;
config.smtp_from = '"Virtualisatie Rapport" <vr@local.mybit.nl>';
config.smtp_to = 'djamon.staal@mybit.nl';

// Do not change anything below this line
module.exports = config;
