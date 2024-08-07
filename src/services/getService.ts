import axios from 'axios';

import instance from './axios';

// 컬럼 목록 조회
export const getColumnsList = async (dashboardId: number) => {
  return await instance.get(`/columns?dashboardId=${dashboardId}`);
};

// 대시보드 목록 조회
export const getDashboardsList = async (
  navigationMethod: 'infiniteScroll' | 'pagination' = 'infiniteScroll', // navigationMethod는 'infiniteScroll' 또는 'pagination'만 가능. 기본값은 'infiniteScroll'
  page: number = 1, // 기본값 1
  size: number = 10, // 기본값 10
) => {
  return await instance.get(`/dashboards?navigationMethod=${navigationMethod}&page=${page}&size=${size}`);
};

// 대시보드 상세 조회
export const getDashboard = async (id: string) => {
  return await instance.get(`/dashboards/${id}`);
};

// 대시보드 멤버 목록 조회
export const getMembersList = async (
  dashboardId: number,
  page: number = 1, // 기본값 1
  size: number = 4, // 기본값 4
) => {
  return await instance.get(`/members?page=${page}&size=${size}&dashboardId=${dashboardId}`);
};

// 대시보드 초대 목록 조회
export const getDashboardInvitations = async (
  dashboardId: number,
  page: number = 1, // 기본값 1
  size: number = 5, // 기본값 5
) => {
  return await instance.get(`/dashboards/${dashboardId}/invitations?page=${page}&size=${size}`);
};

// 내가 받은 초대 목록 조회
export const getInvitationsList = async (size: number = 10, cursorId?: number, title?: string) => {
  const params = new URLSearchParams();
  params.append('size', size.toString());

  if (cursorId) {
    params.append('cursorId', cursorId.toString());
  }
  if (title) {
    params.append('title', title);
  }
  return await instance.get(`/invitations`, { params });
};

// 카드 목록 조회
export const getCardsList = async (columnId: number, size: number = 10, cursorId?: number) => {
  const params = new URLSearchParams();
  params.append('columnId', columnId.toString());
  params.append('size', size.toString());
  if (cursorId) {
    params.append('cursorId', cursorId.toString());
  }
  return await instance.get(`/cards`, { params });
};

// 상세 카드 조회
export const getCard = async (cardId: number) => {
  return await instance.get(`/cards/${cardId}`);
};

// 댓글 목록 조회
export const getComments = async (cardId: number, size?: number, cursorId?: number) => {
  const params = new URLSearchParams();

  params.append('cardId', cardId.toString());

  if (size !== undefined) {
    params.append('size', size.toString());
  }

  if (cursorId !== undefined) {
    params.append('cursorId', cursorId.toString());
  }

  return await instance.get(`/comments`, { params });
};

// 모든 사용자 목록 조회
export const getFavoriteUsers = async () => {
  return await axios.get(`/api/users/`);
};

// 특정 사용자 ID의 즐겨찾기 항목 가져오기
export const getFavorites = async (id: string | null) => {
  if (!id) {
    return { data: [] };
  }
  return await axios.get(`/api/favorites/${id}/`);
};
