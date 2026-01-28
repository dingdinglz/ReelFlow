package user

import (
	"context"
	"net/http"
	"time"

	"ReelFlow/api/internal/svc"
	"ReelFlow/api/internal/types"
	"ReelFlow/rpc/user/user"

	"github.com/golang-jwt/jwt/v4"
	"github.com/zeromicro/go-zero/core/logx"
)

type LoginLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewLoginLogic(ctx context.Context, svcCtx *svc.ServiceContext) *LoginLogic {
	return &LoginLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *LoginLogic) Login(req *types.UserLoginReq) (resp *types.UserLoginResp, err error) {
	i := req
	r, err := l.svcCtx.UserClient.UserLogin(l.ctx, &user.UserLoginReq{
		Username: i.Username,
		Password: i.Password,
	})
	if err != nil {
		return nil, err
	}

	if !r.IsSuccess {
		resp = &types.UserLoginResp{
			Message: types.Message{
				Code:    http.StatusBadRequest,
				Message: "log in failed",
			},
		}
		return
	}
	accessToken, err := l.generateToken(r.Id, l.svcCtx.Config.Auth.AccessExpire)
	refreshToken, err := l.generateToken(r.Id, l.svcCtx.Config.Auth.RefreshExpire)

	return &types.UserLoginResp{
		Message: types.Message{
			Code:    200,
			Message: "log in successfully",
		},
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func (l *LoginLogic) generateToken(id int64, expire int64) (token string, err error) {
	privKey, err := jwt.ParseRSAPrivateKeyFromPEM([]byte(l.svcCtx.Config.Auth.RSAPrivateKey))
	if err != nil {
		return "", err
	}

	now := time.Now().Unix()
	claims := jwt.MapClaims{
		"id":  id,
		"iat": now,
		"exp": now + expire,
		"iss": "ReelFlow",
		"sub": "user-auth",
	}

	jwtToken := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	token, err = jwtToken.SignedString(privKey)
	return token, nil
}
