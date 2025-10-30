import Database from '@ioc:Adonis/Lucid/Database';

export const senderMail = async () => {
  const res = await Database
                      .connection('mssql_portal')
                      .from('ptl_apps')
                      .join(
                        'ptl_mail_sender',
                        'ptl_apps.apps_sender',
                        'ptl_mail_sender.id'
                      )
                      .select('ptl_apps.apps_slug', 'ptl_mail_sender.*')
                      .where('ptl_apps.apps_slug', 'vendor-portal');
  return res;
};