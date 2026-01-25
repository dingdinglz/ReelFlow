package user

import (
	"context"

	"ReelFlow/api/internal/svc"
	"ReelFlow/api/internal/types"
	"ReelFlow/rpc/user/user"

	"github.com/zeromicro/go-zero/core/logx"
)

type LogupLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewLogupLogic(ctx context.Context, svcCtx *svc.ServiceContext) *LogupLogic {
	return &LogupLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *LogupLogic) Logup(req *types.UserRegisterReq) (resp *types.UserRegisterResp, err error) {
	r, err := l.svcCtx.UserClient.UserRegister(l.ctx, &user.UserRegisterReq{
		Username: req.Username,
		Password: req.Password,
	})
	if err != nil {
		return nil, err
	}

	var m types.Message
	if r.IsSuccess {
		m = types.Message{
			Code:    200,
			Message: "success",
		}
	} else {
		m = types.Message{
			Code:    500,
			Message: "register failed",
		}
	}

	return &types.UserRegisterResp{
		Message:   m,
		IsSuccess: r.IsSuccess,
	}, nil
}
