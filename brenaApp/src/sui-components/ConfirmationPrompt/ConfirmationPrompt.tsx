import React from "react";
import "./ConfirmationPrompt.scss";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  updateIsPreviewBtnClicked,
  updateShowConfirmPrompt,
} from "../../store/brenaSlice";

const ConfirmationPrompt = React.memo(() => {
  const tagsList: any = useAppSelector((state: any) => state.brena.tagsList);
  const dispatch = useAppDispatch();
  const showConfirmationPrompt = useAppSelector(
    (state: any) => state.brena.showConfirmPrompt
  );

  const onRemoveBtnClick = () => {
    dispatch(updateIsPreviewBtnClicked(false));
    onCloseBtnClick();
    if (saWebComp?.brenaApi) {
      saWebComp?.brenaApi?.onUIEvent("clearall_click", {tagsList: tagsList});
    }
  };

  const onAddBtnClick = () => {
    dispatch(updateIsPreviewBtnClicked(false));
    onCloseBtnClick();
    if (saWebComp?.brenaApi) {
      saWebComp?.brenaApi?.onUIEvent("addall_click", {tagsList: tagsList});
    }
  };

  const onCloseBtnClick = () => {
    dispatch(updateShowConfirmPrompt(false));
  };
  return (
    <>
      {showConfirmationPrompt && (
        <div className="brena-confirm-prompt">
          <div className="brena-confirm-prompt_left">
            <img
              alt="voice"
              className="brena-icon-cls"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAABRCAYAAACqj0o2AAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAA/dSURBVHhe5V0JlBTVFb2/egZkXxQcRAQXFvcFREGNcBAFIQPGDYREUXNQFBmUBI3HgBpjVHTAuI3RKC5hc2EZEVABARU1uCvKDsM6hF1Zp+vnvl/dTc/QM13dVdUD8s6ZMz30X2+9//97971fKFSy6FFoHQ7jRGUhB5o/CjkaaKTAz/t/1vPzeq2xTimsZzn5e53m55DCMjUICypzGhxrZkU/idrhEnQhaN3Yc1f+NPBhBBsJ7FQLKEQIM9Qd2O5Dm66byAiI+gmcZCvkUsO6UZMu4uiyXY8w9YL7qLFz2U+hZWOKuhNLUm8itRqBgqjzcVZYIZ+ddEhtWP6VJqDvhyzcHeSSDwRE0TyC9zC14UrCEUgfKcKsudwnUDPvU3dhUYp1kxb3dYLUvEZctvdzwP0IXVbS3jNdQKOE43rRCuEBNRBr/ereFxAJXl0buIeDGshBVvNrcIG1o7GL4xxlVcGjagC2eO3HM4iy71H73uFAjvE6mIzX11jDEz1XDcYXXvr2BKIeiVxq4BgOoLqXQVRy3Z2WQl8ePG+nO460QQznc/kqPHSQHBzpzj9aj9YX7gnl4ZF0GkoZRF2AbHsnXiKAfdLp8CCv84pVDTer/tiXyjhTApGmS/2wRQMWaJ9KJ4dSWarkvFAWeqrbscntuF2DqIcjK1wHs2n7XeC28UO1HA30d0PbeOAMp0nkQlyDGB6J59hefxdt/lqKFHCPvMXNZFyBGB7FxjSeddPgr6qMwq2hQUZ5KpSkIJKqam9rzGYrQZIGycZZWd/vszQ60o78qKIBVAgiaatjbdsYon7QVZUFhNd+N1oWziG9trq8hsoFUT+CWnZVzGHFs7yO4ldQ/0urDtqrftidaC7lgsiD5B+sMNQTADUbQ514BbB3O/TiCUDJLk/NpVS51nF0RC8ENv8AbPwqparlFH6EB83drkHUj6GhnY2VrHBE2r2HqsK67DWg+VWmCT1/OPSn96fdXEoVq+fAyp0MHH0uH+A22GPPB7b8mFITCQrvpp/dTOVhQ9nvEmoiXbqR9EgGeeo1uxasHlOAxhc7IC4cDf3eTfwQ9tSsq8pHngar57tAzWOdvqf/HvpHPlCvojEqNBh5SUEkK9OMrMxCT1poelFQJ/8BqsMogFqJLT/BfudqYOtir1NJXr9JJ1hd/gNUqQXsWAl7Ah/kruLk9ZKX2E0u8hRykcvjix6gidTClzn/65O357JE9aO5rNpyaY8mgEthz70LWDNX9MNlAykU48NSLftAtXsA2PQ97I/vBbavAHb/L4VGkhTVGE1tvKFcECNaKIGdkH+9Oi2p8/5qfrBvJ2wuLyzjnlUWSNHYqvV5IERc8yVvOpWrN+IB1RO6mJFROSjkgCq7LagQ1FmDoC54mKBtgj05Fyj+r9/TkPbC1Mbm8dpYShN5Io9loWuD6FmAsH77FiPJ3OR3buBBwyjC9y8AdoQwqXcyrEuep9a24SPkebbkLS5/CdFQGraBdTWtLQH55yLW+zf0Z38nkBHXtmo9qHP/AnXmACCrOvS3z0F/OJjTTWiReJ9eGW2MgaifRg7nI3GHpF5MuqNQLXpDdeEGX7ITevYdPGxe2a9RPICsK2YQqCpO84lAzIpEHpZNgj2Vzzq8xylb+3hYl48j2K0NyPbY88yDClA0DfC60fh2DLCSfNxAhualADs2GqbaPQi9dh4nu4anZ2Mu60lOl+mCmF0Tqvk10KtnQ7UeAl00kw/gjUCnIY0z+6J31iCzcvdrXaBLueyUjrsUVrcJ0N88A/2RxLc8gMilbPX5miDOhJ55G7X8l8ABjHQwjsZ3rxiIhq3eBTnCagc+ggbnOEuvzgnQCx51ByKNZuuqD7nfJVjOAmLfb6nVx3AvfB56zp1muwhcNLZZ1dFAWHCznMnUdCFTQ+s0YKnWANZ15DPECNZ2aRCP7eDsiVaELFr6NuzC3zkDqhDE+gTxG2drCO+Ffv8mfwxrF1AwwNWVAa5pBsSMEK5iw134GM2QgZHhMSnhy1HUHJ6iIk27Oq6aFYn5VwTiymmwpxDgME2dGsdwOdM35gMysrMY9sQu9Je/dAGD5yKGuHVAzOeprNDIc5MVNVD/VGratJgrZorSELanMd6172eaNzR3xNeNytKJ1ESSF4k0cc8W6FkDoTd8BtX2XuMZxRsVetFY6Bk3OiAHK2sJYmNFzvB8coafBNsXp9jxaagzbi012Qr7pDFuT+kRAZEez1Wz9++JyQa7YxXsSd3ptXCvDFho6rRTGaH+uQfKCYoj6I24la1LYI+h3UcaTbXoBXUZbcrofpmsDdlv5w2F/mJEspLev2cIQXE/FI6MvlJwolpeRyP79dQ7ELJiz1agXiuSCTXda7H0RHvRfqszPzBHI1i5R/lCe1U4SLI5F/FAOYfEQyZl10bYr58N/EKjPkghPSaaGJy/3Pg3UKfeCMXf4pplVLiksfwd6M0LoT+nn01yNiAZp+juSUDeYU79FJUF1anAgFjZYo9nvsG6jwMZBgm96aKJwpu39L0HoaY6PgV1uqv4t+/dxxq0S2CPaxcULSZs3tcColxnIHMagPBUVmeQnsqOZt5F+Y7Iby6BAyUZiZSAzGXehyNlfsu/b/oO+oeXgwxLbBAQhXQjURekEJjju0NFYh6mp4QAmi+SDKQCRjwOTL3+00x5LXuC1cQoHOL7XjmLxnL6wcOUH/GGBbDf6JAJr4WamI+v+PDPTHmQbiuEqkF1fpGxj95ua/hUjr65GNwLHmd7AdqKsieWjDQsxGU+jfzAZuq2ILVPGoux4IwLzRv7zU4kJdYF1jV3kEmiif5G98oMV53en2HTfx7osu0jecpAkqZ7Z7wSofol3mL2Nfnho+XdtZiI3Sf/Lr/pCiLMstUb0v5sBiVhgfon72eAopVYzgSs1vAhBicFAuJwjneYL31w0qr1UNqG/ZxA1OLx1EKGR3Palj4wGP+wCxmE2vB5JFDlJXxKoLNrQJ2d50QTo1SaTEh8aJK0+ptnoc7nNFv1gS0BrKUMmPklGvf7S0DwYojVb5lDkPJ0tGfc4ETpolyfDFyCVO/dDL1ILh1QajBfR/bLejRVd/ICqYRSN0ioMwGwzGxQp90MRe9HMyyqF5EhX/V+zHxR7f4G1YbpQ/FALi8kcHnOwVarCbVyDn1qLnHaj76IEBCMNfdkxkPa1w9KDYSROutWulcS8lw9C/Ynw5z9MN5s4dKyJ17uUPhcitbVDFrVIJVpli6Bk7i0RPJWyNWYOGESgHXtfNZpur89Wa6SVbGKjLiI5OAI0UGwzWFiM2VlGxMGmL5i9WB79VowE2MR7Nf4fTRU6xFJ5i9eISBK2kiptIi02xUQbyMRKoCQmRZNUV1NQCwmeiaTbr8t4N9c+ufeDdX+IRQUFGDMmDHo3r07hgwZwrpxhKypSRJDvB/ykQUFz5cuW/wF00R4cbWiuEqVOk7oQbaV7cthj6bW+wfi8dHwgC+unyKI6nax3RXjHNSIFVNLU2Dco+zxzG4QQ1jCBZ15k4NLuU0bBuwpOTk5KCwsNPk69mhqTVSo2daVH/AqefsDy0o44HVaaNwKyhWGVa0eUxmWJdjCpkvb/oD4E5ntVlEQveciygziNXHxG7B/eMlZRvGaOON6J2gvvvV59/FnGEaMGGHA6927N/r3Z249wbcnyZ3yqFATL2aiGuMzI0Y8Xrrs+vmOGRPVRMmS4N4c21PlNJc0P9FEya7wVxNNzqIT7ctHBy5p7rweRUC8hfcNmcphNvC5Q2BdQ/YkfqMXslSoe4l/SOZCr8948BwVt97DjllCIEuJLEk56Y86ff8/M9ZiT+TlfdFskbrNYXXn9l7LSakzsvlHs8caEM2eyOy019iGD5poQgN3YL4D4nBUseugmKuwjicYSd9b/bi9yunME9ae3teJF0tmWFQYlLKnM7DEPdOZeAuTuaAkDr17s6OlywXABF5G/VNY9k+ODy6Hynf/AlbKoSJluce2u5+nM4n6+IcmUcM5d3EccjrzUGL2hf1mR++nM+POzA6rK1OIefu+kLNiJ572R6hml8Ne+KrJ/DImTg5zY2LCE3jHatizyO5EweLSNktQEpSSaUiistR8A66YN8Y/j0yLmWOa5o0E9SXZSR3XGTZtRiFrfUjtK50BIfMrGYVeSpsbo76K8ImOx1LmDrmARa3Q62i2iMdiRDySiMcS81yiwxEPRsCJeDLRz1VqQzW9lPcbmJ8vAMeLaKtsHWslH9JfSZiLI28JYehUZpOMi0ptNOI7S7hTbMFMC/O0zaHzi2+X7KMzSJwVJt/6sqTLAiWZYIbFuS6zEIrLx2QpvUDCpr6zOLGlLJMqpXWBZcqSIDDaSHstY8KYiv02ySkeZD7Lbu5MrXgLdWXcRlO6i6DycgybcwHN0armQAtWti1jekpfmj4BJHYkuEFwwP7nyx2WRBDx9JXYs2r/4IEHgJ+QkmKz32XaYHlmkre+ttM2PIm24cb4ZhIeIr7cpko4WJpALZkSIoH8hgys+3qG8VRf94lzY4BZs4EIaS/ahsPLtp0QxMhJLS/hCSYKKInqJ/agbfdnh0z1KmRmJECvSVwEFqTXKLb2UguHYocrEKUQyVqynMj3Or8K64eyoSTPpvYJJtdGi9fB9SLehxbDXRKYJDvW0GQkNWK6y9OW1zA0yQehusy1DCZ4Bioag6mFIxP1Ua5NaF5XUBcfsABzQA5v4cObF9rKe8/lvM6gQsOay7oBDXChmXll8zAVjSIrzPvOQ0xOe0JJ6p0QyLMJJOnnQ/oFQulpAF+HxY2kPW/eV3jXNymI0juTnnrTVeWNw8NL6PRcm3UnxiebtSsQIweN9+u7yUZzcH1f7iXxssN0DeLhdNCY9+LkmbeOuorlugZR0D9MDpqfaGW1TeW9tCmBaIB0bl89yY+VnHgYwNrXeIG3pAYE+q6w+GHTNZS3NT3NH9/vRgcAT8VNauwlyTogKw8vptN3ypoY3wmvs3XidTamIeDIdDo/SOpsohnTjS/IiES7Uh+VJxDN8n4KTZmRwatSoP92iAnT4ng/L5cArvIycs8gGiCfQDXbAiNPIIWCel4GlKG68h7Zh/m246f4Hm7Pd9d8ATE6cf0M6tl7cR8Ng9vIF0Su0GcIFjfdcO/juJ4htfmAHy/kjXbpK4gxMJ38nmEEk+90ISVT2aJNkOVVDmQ4XbgVfg8nEBBjYD6BU/nS8pE0Wi/xe+Bu2zNvfNfI47L93m2dVMsFCmIcmNH/eyCXgPIFXoGaRWECN4/9TOGeN+mQ/78HEj1R2TeZKZzLBSaAMuoOP0KAPxO4Gdw4JpPnneznfudGKzOiieUNhP64RQszB2EwhZXvatTmt/lMp7UJQW7CfbUh99ViglTE36uZpVHE74u4v63m30XU6SK+Qnc9CVPfg8tuAJQy/wdN950LKFxWngAAAABJRU5ErkJggg=="
            />
          </div>
          <div className="brena-confirm-prompt_right">
            <div
              className="brena-confirm-prompt_right-close"
              onClick={onCloseBtnClick}
            >
              +
            </div>
            <div className="brena-confirm-prompt_right-title">Confirmation</div>
            <div className="brena-confirm-prompt_right-desc">
            There are a few suggested tasks in the schedule as preview. 
              <br />
              Would you like to add them to the schedule?
            </div>
            <div className="brena-confirm-prompt_right-buttons">
              <button
                className="brena-confirm-prompt_right-buttons_remove-btn"
                onClick={onRemoveBtnClick}
              >
                REMOVE
              </button>
              <button
                className="brena-confirm-prompt_right-buttons_add-btn"
                onClick={onAddBtnClick}
              >
                ADD
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default ConfirmationPrompt;
