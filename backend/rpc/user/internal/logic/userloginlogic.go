package logic

import (
	"context"

	"ReelFlow/rpc/user/internal/svc"
	"ReelFlow/rpc/user/user"

	"github.com/zeromicro/go-zero/core/logx"
)

type UserLoginLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewUserLoginLogic(ctx context.Context, svcCtx *svc.ServiceContext) *UserLoginLogic {
	return &UserLoginLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

// 登录
func (l *UserLoginLogic) UserLogin(in *user.UserLoginReq) (*user.UserLoginResp, error) {
	// todo: add your logic here and delete this line

	return &user.UserLoginResp{}, nil
}
