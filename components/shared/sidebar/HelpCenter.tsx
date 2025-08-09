import Button from '@/components/shared/Button';

const GOOGLE_FORM_URL = 'https://forms.gle/7jEc8cKfELoKDFPb7';

export default function HelpCenter() {
  return (
    <div className="flex flex-col gap-4">
      <p>버그를 발견하셨다면 알려주세요!</p>
      <Button
        onClick={() => window.open(GOOGLE_FORM_URL, '_blank')}
        text='버그 제보하기'
      />
    </div>
  );
}