function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function showListOfItems(item_list, header_text, link_text) {
    if (item_list) {
        html_to_add = "<h4>" + header_text + "</h4>"
        html_to_add += "<ul>";
        for (itr = 0; itr < item_list.length; itr++) {
            var elem = item_list[itr]["S"];
            if (link_text) {
                html_to_add += "<li><span><a href='" + link_text + elem + "'>" + elem + "</a></span></li>";
            } else {
                html_to_add += "<li><span>" + elem + "</span></li>";
            }
        }
        html_to_add += "</ul>";
        return html_to_add;
    }

    return "";
}

function getUserDetails() {
    var Accesstoken = sessionStorage.getItem('AccessToken');
    user_id = getParameterByName("id");
    request_url = "https://vjbj3fv2sc.execute-api.us-east-1.amazonaws.com/PicssharzProd/userid/" + user_id
    followUnfollowButtonClick();

    $.ajax({
        url: request_url,
        type: 'GET',
        headers: {
            'Authorization': Accesstoken
        },
        success: function (data) {
            if (data) {
                first_item = data["Items"][0];
                if (first_item) {
                    console.log(first_item);
                    user_result_username = first_item["username"]["S"];
                    user_result_dob = first_item["dob"] ? first_item["dob"]["S"] : "";
                    user_result_about = 'About:  ' + first_item["about"] ? first_item["about"]["S"] : "";
                    user_result_account_created_time = 'Account Created timestamp: ' + first_item["account_created_time"] ? first_item["account_created_time"]["S"] : "";
                    user_result_likes = first_item["likes"] ? first_item["likes"]["L"] : "";
                    user_result_country = 'Country:  ' + first_item["country"] ? first_item["country"]["S"] : "";
                    user_result_following = first_item["following"] ? first_item["following"]["L"] : "";
                    user_result_followers = first_item["followers"] ? first_item["followers"]["L"] : "";
                    user_uploaded_images = first_item["uploaded_images"] ? first_item["uploaded_images"]["L"] : "";

                    //user_result_name = 'Hi ' + user_result_name 
                    document.getElementById("name").innerHTML = user_result_username;
                    document.getElementById("about").innerHTML = user_result_about;
                    document.getElementById("country").innerHTML = user_result_country;
                    document.getElementById("account_created_time").innerHTML = user_result_account_created_time;
                    other_details_html = showListOfItems(user_result_likes, "Likes", "image_details.html?id=");
                    other_details_html += showListOfItems(user_result_following, user_result_username + " is following", "user_details.html?id=");
                    other_details_html += showListOfItems(user_result_followers, user_result_username + "'s followers", "user_details.html?id=");
                    other_details_html += showListOfItems(user_uploaded_images, user_result_username + "'s images", "image_details.html?id=");
                    document.getElementById("other_info").innerHTML += other_details_html;
                }
            }

        }

    });
}

function followUnfollowUser() {
    var Accesstoken = sessionStorage.getItem('AccessToken');
    following_id = getParameterByName("id");
    console.log("following_id:", following_id);
    var currentUserId = sessionStorage.getItem("UserId");
    console.log("Current user ID: " + currentUserId);
    if (currentUserId) {
        data = {
            user_id: currentUserId,
            following_id: following_id
        };
        //console.log(data)
        var settings = {
            "async": true,
            "dataType": "json",
            "crossDomain": true,
            "url": " https://vjbj3fv2sc.execute-api.us-east-1.amazonaws.com/PicssharzProd/follow",
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": Accesstoken
            },
            "processData": false,
            //"data": data
            //"data": "{\n\"user_id\": \"3\",\n\"following_id\": \"7\"\n}"
            "data": JSON.stringify(data)
        }
        console.log(settings)
        $.ajax(settings).done(function (response) {
            sessionResponse = response["Attributes"];

            // update the user details based on the response
            sessionStorage.setItem("UserDetails", JSON.stringify(sessionResponse));
            followUnfollowButtonClick();
            location.reload();
        });
    }


}

function followUnfollowButtonClick() {
    following_id = getParameterByName("id");
    sessionResult = sessionStorage.getItem("UserDetails")
    console.log(sessionResult)
    if (sessionResult) {
        sessionResult = JSON.parse(sessionResult)
        console.log(sessionResult)
        followingList = sessionResult["following"]
        console.log(followingList)
        if (following_id != sessionStorage.getItem("UserId")) {
            if (followingList && followingList.indexOf(following_id) >= 0) {
                console.log("following id in list")
                document.getElementById("clickfollow").value = "Unfollow";
            } else {
                console.log("following id not in list")
                document.getElementById("clickfollow").value = "Follow";

            }
            localStorage.setItem("followButton", document.getElementById("clickfollow").value);
        }
      else{
          $("#clickfollow").hide();
      }  
    }

}