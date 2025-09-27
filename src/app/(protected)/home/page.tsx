import { auth } from '@/auth';
import { Page } from '@/components/PageLayout';
import { Pay } from '@/components/Pay';
import { Transaction } from '@/components/Transaction';
import { UserInfo } from '@/components/UserInfo';
import { Verify } from '@/components/Verify';
import { ViewPermissions } from '@/components/ViewPermissions';
import { WelcomeMessage } from '@/components/WelcomeMessage';
import { Marble, TopBar } from '@worldcoin/mini-apps-ui-kit-react';
import ky from 'ky';

async function checkUserExists(walletAddress: string): Promise<boolean> {
  try {
    const baseUrl = process.env.APP_BASE_URL;
    
    const response = await ky.get(`${baseUrl}/api/user?address=${walletAddress}`, {
      cache: 'no-store'
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error checking user:', error);
    return false;
  }
}

export default async function Home() {
  const session = await auth();
  
  const userExists = session?.user?.walletAddress ? 
    await checkUserExists(session.user.walletAddress) : false;

  return (
    <>
      <Page.Header className="p-0">
        <TopBar
          title="Home"
          endAdornment={
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold capitalize">
                {session?.user.username}
              </p>
              <Marble src={session?.user.profilePictureUrl} className="w-12" />
            </div>
          }
        />
      </Page.Header>
      <Page.Main className="flex flex-col items-center justify-start gap-4 mb-16">
        {userExists ? (
          <>
            <UserInfo />
            {/* <Verify />
            <Pay />
            <Transaction />
            <ViewPermissions /> */}
          </>
        ) : (
          <WelcomeMessage />
        )}
      </Page.Main>
    </>
  );
}
