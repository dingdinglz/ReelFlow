package logic

import (
	"context"

	"ReelFlow/rpc/user/internal/svc"
	"ReelFlow/rpc/user/user"

	"github.com/zeromicro/go-zero/core/logx"
)

type RefreshTokenLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewRefreshTokenLogic(ctx context.Context, svcCtx *svc.ServiceContext) *RefreshTokenLogic {
	return &RefreshTokenLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

// 刷新 Token
func (l *RefreshTokenLogic) RefreshToken(in *user.RefreshTokenReq) (*user.UserLoginResp, error) {
	i := in
	userInModel, err := l.svcCtx.Model.FindOne(l.ctx, i.Id)
	if err != nil {
		return nil, err
	}
	return &user.UserLoginResp{
		IsSuccess: true,
		Id:        userInModel.Id,
	}, nil
}
