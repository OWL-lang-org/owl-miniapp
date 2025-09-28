import { auth } from '@/auth';
import { Page } from '@/components/PageLayout';
import { UserInfo } from '@/components/UserInfo';
import { WelcomeMessage } from '@/components/WelcomeMessage';
import { Marble, TopBar } from '@worldcoin/mini-apps-ui-kit-react';
import ky from 'ky';
import { IUser } from '../../../../types/user';
import { redirect } from 'next/navigation';

async function checkUserStatus(walletAddress: string): Promise<{ shouldShowWelcome: boolean, shouldRedirectToStory: boolean }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;
    if (!baseUrl) {
      throw new Error('BASE_URL is not set');
    }
    const response = await ky.get(`${baseUrl}/api/user?address=${walletAddress}`, {
      cache: 'no-store'
    });
    
    const userData: IUser = await response.json();
    console.log('User check response:', userData);
    const hasStatus = userData?.status;
    console.log('hasStatus:', hasStatus);
    
    if (hasStatus) {
      return { shouldShowWelcome: false, shouldRedirectToStory: true };
    } else {
      return { shouldShowWelcome: true, shouldRedirectToStory: false };
    }
  } catch (error) {
    console.error('Error checking user:', error);
    return { shouldShowWelcome: true, shouldRedirectToStory: false };
  }
}

export default async function Home() {
  const session = await auth();
  
  let shouldShowWelcome = false;
  
  if (session?.user?.walletAddress) {
    const userStatus = await checkUserStatus(session.user.walletAddress);
    
    if (userStatus.shouldRedirectToStory) {
      redirect('/story');
    }
    
    shouldShowWelcome = userStatus.shouldShowWelcome;
  }

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
        {shouldShowWelcome ? (
          <WelcomeMessage />
        ) : (
          <>
            <UserInfo />
            {/* <Verify />
            <Pay />
            <Transaction />
            <ViewPermissions /> */}
          </>
        )}
      </Page.Main>
    </>
  );
}
