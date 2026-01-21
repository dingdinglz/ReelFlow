package user

import (
	"net/http"

	"ReelFlow/api/internal/logic/user"
	"ReelFlow/api/internal/svc"
	"ReelFlow/api/internal/types"
	"github.com/zeromicro/go-zero/rest/httpx"
)

func LogupHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.UserRegisterReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := user.NewLogupLogic(r.Context(), svcCtx)
		resp, err := l.Logup(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}
