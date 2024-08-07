import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import DashboardModifySection from './DashboardModifySection';
import InvitedMembersSection from './InvitedMembersSection';
import MembersSection from './MembersSection';

import useDeleteData from '@/hooks/useDeleteData';
import useFetchData from '@/hooks/useFetchData';
import useModal from '@/hooks/useModal';
import useRedirectIfNoPermission from '@/hooks/useRedirectIfNoPermission';
import { deleteDashboard } from '@/services/deleteService';
import { getDashboard } from '@/services/getService';
import { Dashboard } from '@/types/Dashboard.interface';
import { DeleteDashboardInput } from '@/types/delete/DeleteDashboardInput.interface';
import { checkPublic } from '@/utils/shareAccount';

export default function DashboardEdit() {
  const redirectIfNoPermission = useRedirectIfNoPermission();
  const { openConfirmModal } = useModal();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { id } = router.query;

  const { data: dashboard, error } = useFetchData<Dashboard>(['dashboard', id], () => getDashboard(id as string));
  const [isPublic, setIsPublic] = useState(false);

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['sideDashboards'] });
    router.replace('/mydashboard');
  };
  const { mutate } = useDeleteData<DeleteDashboardInput>({ mutationFn: deleteDashboard, handleSuccess });

  const handleIsPublicChange = (newIsPublic: boolean) => {
    setIsPublic(newIsPublic);
  };

  const handleMemberDelete = (email: string) => {
    if (email === process.env.NEXT_PUBLIC_SHARE_ACCOUNT_EMAIL) {
      setIsPublic(false);
    }
  };

  const handleDeleteClick = () => {
    const handleDelete = async () => {
      if (!id) return;
      await mutate({ dashboardId: Number(id) });
    };

    openConfirmModal({
      text: `대시보드와 모든 구성요소가 사라집니다.\n정말 삭제하시겠습니까?`,
      onActionClick: handleDelete,
    });
  };

  useEffect(() => {
    const handleInitIsPublic = async () => {
      try {
        setIsPublic(await checkPublic(Number(id)));
      } catch {
        redirectIfNoPermission(-1);
      }
    };

    if (id) {
      handleInitIsPublic();
    }
  }, [id]);

  useEffect(() => {
    if (dashboard) {
      redirectIfNoPermission(dashboard.userId);
    } else if (error) {
      redirectIfNoPermission(-1);
    }
  }, [dashboard, error]);

  return (
    <div className='h-full px-3 py-4 text-black-33 md:p-5 dark:text-dark-10'>
      <Link
        href={`/dashboard/${id}`}
        className='mb-5 flex items-center gap-1.5 text-sm font-medium md:mb-6 md:text-base'
      >
        <div className='relative size-[18px] rotate-180 md:size-4'>
          <Image src='/icons/arrow-black.svg' alt='뒤로가기 아이콘' fill className='dark:hidden' />
          <Image src='/icons/arrow-white.svg' alt='뒤로가기 아이콘' fill className='hidden dark:block' />
        </div>
        돌아가기
      </Link>
      <div className='flex flex-col gap-4'>
        <DashboardModifySection initIsPublic={isPublic} onPublicChange={handleIsPublicChange} />
        <MembersSection onDeleteMember={handleMemberDelete} />
        <InvitedMembersSection />
      </div>
      <button
        type='button'
        className='btn-gray gray-border my-8 size-fit rounded-lg px-[84px] py-4 text-base font-medium md:my-12 md:px-[95px] md:py-5 md:text-lg dark:bg-violet/40 dark:text-white dark:hover:bg-violet-hover/60 dark:active:bg-violet-hover/70'
        onClick={handleDeleteClick}
      >
        대시보드 삭제하기
      </button>
    </div>
  );
}
