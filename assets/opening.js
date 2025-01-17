jQuery(function ($) {
	//クッキーの取得
	function getCookie(name) {
		let nameEQ = name + "=";
		let ca = document.cookie.split(";");
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == " ") c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	}

	function setCookie(name, value, days) {
		var expires = "";
		if (days) {
			let date = new Date();
			date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
			expires = "; expires=" + date.toUTCString();
		}
		document.cookie = name + "=" + (value || "") + expires + "; path=/";
	}

	function eraseCookie(name) {
		console.log("erase");
		document.cookie =
			name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
	}

	// cookie名を設定します。
	const ANIM_COOKIE_SKIP = "animation_shown";
	let is_anime_skip = false;
	if ($("#splash").length && $(".opening_check").length == 0) {
		// オープニングがあってオープニングスキップのチェックボックスがなければ、cookieを削除します。
		eraseCookie(ANIM_COOKIE_SKIP);
		//$.removeCookie(ANIM_COOKIE_SKIP);
	} else {
		is_anime_skip = getCookie(ANIM_COOKIE_SKIP) === "true";
		$("input[name='anim_is_skip']").prop("checked", is_anime_skip);
		//読込終了後に表示
		$(".opening_check").css("display", "block");
	}

	if (!is_anime_skip) {
		//アニメーションをスキップしない処理
		$("#splash").css("display", "block");
	} else {
		//アニメーションをスキップする場合の処理
		$(".fixbg").trigger("openAnimationEnd"); //アニメーションが終了したことのトリガーを発生
		$(".opening_check").addClass("closing"); //チェックボックスのスタイルを変更
		$(
			".wp-block-itmar-logo-anime, .wp-block-itmar-tea-time, .wp-block-itmar-welcome",
		).css("display", "none"); //アニメーションブロックの消去
	}

	// チェックボックスのクリックイベントを監視します。
	$("input[name='anim_is_skip']").on("change", function () {
		if ($(this).is(":checked")) {
			// チェックボックスが選択されたら、cookieに記録します。継続期間は３０日にします。
			setCookie(ANIM_COOKIE_SKIP, "true", 30);
			//$.cookie(ANIM_COOKIE_SKIP, 'true', { expires: 1, secure: true, sameSite: 'None' });
			is_anime_skip = true;
		} else {
			// チェックボックスの選択が解除されたら、cookieを削除します。
			eraseCookie(ANIM_COOKIE_SKIP);
			//$.removeCookie(ANIM_COOKIE_SKIP);
			is_anime_skip = false;
		}
	});
	/*===========================================================*/
	/*エンディングアニメーション*/
	/*===========================================================*/
	const endingAnimation = (ending_type) => {
		const splash = document.getElementById("splash");
		const splash_logo = document.getElementById("splash_logo");
		const splashbg = document.getElementsByClassName("splashbg")[0];
		const splashbg2 = document.getElementsByClassName("splashbg2")[0];
		const splashCirclebg = document.getElementsByClassName("splashCirclebg")[0];
		const fixbg = document.getElementsByClassName("fixbg")[0];
		const $fixbg = $(fixbg);

		splash_logo
			.animate([{ opacity: 1 }, { opacity: 0 }], {
				delay: 800,
				duration: 1000,
				fill: "both",
			})
			.addEventListener("finish", () => {
				//オープン型
				if (ending_type === "virtical_open" || ending_type === "horizen_open") {
					fixbg.classList.add("hide"); //フェード用背景非表示
					//splash.classList.add('disappear');
					splash.animate([{ opacity: 0 }], { duration: 0, fill: "both" });
					splashbg.classList.add("appear"); //フェードアウト後appearクラス付与
					splashbg.classList.add(ending_type); //フェードアウト後クラス付与
					splashbg2.classList.add("appear"); //フェードアウト後appearクラス付与
					splashbg2.classList.add(ending_type); //フェードアウト後appearクラス付与
					splashbg2.addEventListener("animationend", function () {
						splash.parentElement.style.display = "none";
						// design-groupのアニメーション発火のためのカスタムイベントを発生させる
						$fixbg.trigger("openAnimationEnd");
						// アニメーションスキップのチェック（$fixbgの親要素の直後の兄弟要素）にclosingクラスを付加
						$(this).parent().next().addClass("closing");
					});
					//スライド型
				} else if (
					ending_type === "virtical_slide" ||
					ending_type === "horizen_slide"
				) {
					splash
						.animate([{ opacity: 1 }, { opacity: 0 }], {
							delay: 800,
							duration: 1000,
							fill: "both",
						})
						.addEventListener("finish", () => {
							splashbg.classList.add("appear"); //フェードアウト後appearクラス付与
							splashbg.classList.add(ending_type); //フェードアウト後appearクラス付与
							fixbg.classList.add("disappear"); //フェードアウト後disappearクラス付与
							//最終処理
							$fixbg.on("transitionend", function () {
								splash.parentElement.style.display = "none";
								// design-groupのアニメーション発火のためのカスタムイベントを発生させる
								$(this).trigger("openAnimationEnd");
								// アニメーションスキップのチェック（$fixbgの親要素の直後の兄弟要素）にclosingクラスを付加
								$(this).parent().next().addClass("closing");
							});
						});
					//円形拡張型
				} else if (ending_type === "circle_expand") {
					splash
						.animate([{ opacity: 1 }, { opacity: 0 }], {
							delay: 800,
							duration: 1000,
							fill: "both",
						})
						.addEventListener("finish", () => {
							splashCirclebg.classList.add("appear"); //フェードアウト後appearクラス付与
							fixbg.classList.add("disappear"); //フェードアウト後disappearクラス付与
							//最終処理
							$fixbg.on("transitionend", function () {
								splash.parentElement.style.display = "none";
								// design-groupのアニメーション発火のためのカスタムイベントを発生させる
								$(this).trigger("openAnimationEnd");
								// アニメーションスキップのチェック（$fixbgの親要素の直後の兄弟要素）にclosingクラスを付加
								$(this).parent().next().addClass("closing");
							});
						});
				}
			});
	};

	/*===========================================================*/
	/*ロゴアウトラインアニメーション*/
	/*===========================================================*/
	//SVGアニメーションの描画

	if ($("#logo_anime").get(0)) {
		if (!is_anime_skip) {
			//スキップフラグがonでない
			//HTMLからスタイル要素を取得
			let splashElement = $("#splash");
			let fillColor = splashElement.data("fill-color");
			let strokeColor = splashElement.data("stroke-color");
			let ending_type = splashElement.data("ending-type");
			//初期設定
			$("#logo_anime path").each(function () {
				const length = $(this).get(0).getTotalLength();
				$(this).css({
					stroke: strokeColor,
					strokeDasharray: length,
					strostrokeDashoffsetke: length,
				});
			});

			// アニメーションを開始

			const animatePaths = (paths) => {
				paths.each((index, pathElement) => {
					const path = $(pathElement);
					const length = path.get(0).getTotalLength();

					path
						.get(0)
						.animate([{ strokeDashoffset: length }, { strokeDashoffset: 0 }], {
							duration: 1000,
							fill: "both",
							delay: index * 800,
						})
						.addEventListener("finish", () => {
							if (index === paths.length - 1) {
								$("#logo_anime").addClass("done"); //描画が終わったらdoneというクラスを追加
								$("#logo_anime path").css({
									fill: fillColor,
									stroke: "none",
								});
								// Reset all paths
								paths.each((i, pathToReset) => {
									$(pathToReset).css({
										"stroke-dashoffset": "",
										"stroke-dasharray": "",
									});
								});

								//ここからオープニング終了アニメーション
								endingAnimation(ending_type);
							}
						});
				});
			};

			animatePaths($("#logo_anime path"));
		}
	}

	/*===========================================================*/
	/*コーヒーカップ*/
	/*===========================================================*/
	if ($("#splash .coffee").get(0)) {
		if (!is_anime_skip) {
			//スキップフラグがonでない
			let splashElement = $("#splash");
			let ending_type = splashElement.data("ending-type");
			let duration = splashElement.data("duration");
			setTimeout(() => {
				//ここからオープニング終了アニメーション
				endingAnimation(ending_type);
			}, duration * 1000);
		}
	}

	/*===========================================================*/
	/*Welcome*/
	/*===========================================================*/
	if ($("#splash .wrapper__letters").get(0)) {
		if (!is_anime_skip) {
			//スキップフラグがonでない
			let splashElement = $("#splash");
			let ending_type = splashElement.data("ending-type");
			// 要素を取得
			const letter_mask = document.getElementById("letters-svg-mask");
			letter_mask.addEventListener("animationend", function () {
				//ここからオープニング終了アニメーション
				endingAnimation(ending_type);
			});
		}
	}
});
