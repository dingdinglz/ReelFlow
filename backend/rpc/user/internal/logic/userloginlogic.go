package logic

import (
	"context"

	userModel "ReelFlow/rpc/model/user"
	"ReelFlow/rpc/user/internal/logic/hash"
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
	i := in
	userInModel, err := l.svcCtx.Model.FindOneByUsername(l.ctx, i.Username)
	if err != nil {
		return nil, err
	}
	if match, _ := hash.ComparePasswordAndHash(i.Password, userInModel.Password); userInModel.Username != i.Username || !match {
		return nil, userModel.ErrNotFound
	}

	return &user.UserLoginResp{
		IsSuccess: true,
		Id:        userInModel.Id,
	}, nil
}
