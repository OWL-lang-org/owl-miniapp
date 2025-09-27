import { Page } from '@/components/PageLayout';
import { AuthButton } from '../components/AuthButton';

export default function Home() {
  return (
    <Page>
      <Page.Main className="flex flex-col items-center justify-center">
      <video key={'11110'} src={`/story/video/intro.mp4`} controls autoPlay={true} className="w-full rounded-lg border" />
        <AuthButton />
      </Page.Main>
    </Page>
  );
}
