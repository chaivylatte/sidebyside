<script>
function loadJsFile(filename, ifNotExists, callback ) {
    if (!ifNotExists)  {
        let fileref = document.createElement('script')
        fileref.setAttribute("type", "text/javascript")
        fileref.setAttribute("src", filename)
        if (callback) {
            fileref.onreadystatechange = callback;
            fileref.onload = callback;
        }
        document.head.appendChild(fileref);
    } else if (callback) {
        callback();
    }
}

function createTrackerElements (params) {

    const Open_Thread_Wrapper = $("<div class='fizztrackerwrap'></div>");
    const Alt_Thread_Wrapper = $("<div class='fizztrackerwrap'></div>");
    $(params.currentScript).before(Open_Thread_Wrapper);
    $(params.currentScript).before(Alt_Thread_Wrapper);

    let nameid = params.characterName.replace(/[^a-zA-Z]/g, '')
    params.thisTracker = "#track"+nameid;
    params.thisAltTracker = "#alt"+nameid;

    Open_Thread_Wrapper.append(`<fizzyheadwr class="fizzythreads"><h1>active threads</h1><i></i></fizzyheadwr>`).on('click', 'fizzyheadwr i', RefreshParticipatedTracker(params));
    Alt_Thread_Wrapper.append(`<fizzyheadwr class="fizzycomms"><h1>active comms</h1><i></i></fizzyheadwr>`);

    $(Open_Thread_Wrapper).append($(`<div class="fizzyelftrackersur" id="track${nameid}"></div>`));
    $(Alt_Thread_Wrapper).append($(`<div class="fizzyelftrackersur" id="alt${nameid}"></div>`));
}

function TrackParticipatedThreads(params = {}) {
    if (window.trackernum === undefined) window.trackernum = 0;
    else trackernum++;
    params.trackernum = trackernum;
    const Is_Mobile = (document.getElementById("mobile") !== null);
console.log("tracker num ", trackernum)

    const scriptelements = document.getElementsByTagName("script");
    params.currentScript = scriptelements[scriptelements.length - 1];

    if (!params) {
        params = {};
    }
    if (!params.indicators) {
        params.indicators = ['<i class="fa-solid fa-comments"></i>', '<i class="fa-solid fa-comments"></i>'];
    }
    if (!params.floodControl) {
        params.floodControl = 5;
    }
    if (!params.rowClass) {
        params.rowClass = ".post-normal"
    }

    loadJsFile('https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.js', window.jQuery, function() {
        if (!params.characterName) {
            params.characterName = $(params.currentScript).closest(`.mobile-post, ${params.rowClass}`).find("a[href*=showuser]").first().text().trim();
        }
        createTrackerElements(params, params.currentScript);
        loadJsFile('https://files.jcink.net/uploads2/fizzyelf/sharedresources/autoTrackerMainProfile.js', window.FillTracker, function() {
            console.log(params.characterName, "tracker num ", params.trackernum,"timeout: ", params.floodControl * 1000 * params.trackernum )
            setTimeout(async () => {

                await FillTracker(params.characterName, params);
                if (Is_Mobile) $.get("/?act=mobile");
                if ($(params.thisAltTracker).text() != "None") $(params.thisAltTracker).parent().show();
                
            }, params.floodControl * 1000 * params.trackernum); 
            
        })
    });

}

function RefreshParticipatedTracker (params, Is_Mobile) {
    return function() {
        $(params.thisTracker).html('');
        $(params.thisAltTracker).html('');
        setTimeout(async () => {
            await FillTracker(params.characterName, params);
            if (Is_Mobile) $.get("/?act=mobile");
            if ($(params.thisAltTracker).text() != "None") $(params.thisAltTracker).parent().show();
            
        }, 0); 
    }
}

const trackerParams = { 
    includeCategoryIds: ['5', '6', '7'],
    ignoreForumIds: ['33', '34'],
  
    altForumIds: ['49', '50', '102'],

    floodControl: 0,
}
</script>