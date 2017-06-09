var map = L.map('mapid').setView([45.5314,-73.6750], 11);
var baseLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
				 maxZoom: 18,
				 attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'})
				 .addTo(map);
		


function renderStory(story){			

story = story ;
geo = story.geo_infos.features;
var title = story.title.rendered;
var auteurs = story.acf.auteurs[0].post_title;	

var storyId = story.id
var storyLink = story.link;
var ptag	= story['primary_tag'];
var stag	= story['secondary_tag'];
var genre = story.genre;
var project = story.project;

var markers = L.markerClusterGroup();  


function get_random_color(){
	 var letters = '0123456789ABCDEF'.split('');
	 var color = '#';
	 for (var i = 0; i < 6; i++) 
	  {
		color += letters[Math.round(Math.random() * 15.66)];
	  }
		return color;
	}

var setColor = {
		radius: 8,
		fillColor: get_random_color(),
		color: '#ffffff',
		weight: 1,
		opacity: 1,
		fillOpacity: 0.8
		
		
			};
	
var marker = L.geoJSON(geo,{

	filter: function(feature, layer) {
	return feature.properties.main == true;	
		//return  == true;	
	},
		   
	pointToLayer: function(feature, latlng) {
		return L.circleMarker(latlng,setColor)//, style(feature)); //,styled(feature));
	},
	onEachFeature: function (feature, layer) {
		//
        layer.bindPopup('<h1><b>'+title+'</b></h1><p>'+ auteurs+'</p>');
		//feature.layer = layer;
		
			}
		});
		
 markers.addLayer(marker);
 map.addLayer(markers);

 //var lGroup = L.layergroup(markers)
//map.fitBounds(lGroup.getBounds());

}

function toggleLayer(){
var baseMaps={}
var overlays = {
    'Ajouter': auteursmarker,

};
L.control.layers(baseMaps,overlays).addTo(map);
}
//toggleLayer();
function easyButton(){

L.easyButton( 'test', function(){
  
}).addTo(map);

 
L.easyButton( 'TEST', function(){
  map.setView([38, 139], 4);
}).addTo(map);

L.easyButton( 'fa-usd', function(){
  map.setView([37.8, -96], 3);
}).addTo(map);
}
//easyButton();
function getGeoJSON(){

		$.getJSON('http://staging-lrsm.anagraph.io/wp-json/wp/v2/story',
			function (stories){
				 stories.map(renderStory);	
					}
				)};
getGeoJSON()


/*autocomplete tasks*/

function renderGenre(genre){
 genre=genre
 genre_id=genre.id
 name = genre.name

}

function getGenre(){
		$.getJSON('http://staging-lrsm.anagraph.io/wp-json/wp/v2/genre', 
		function(genres) {
		genres.map(renderGenre);
		
		})}
getGenre();

function renderTag(tag){
 tag=tag
 tag_id=tag.id
 name = tag.name

}

function getTag(){
		$.getJSON('http://staging-lrsm.anagraph.io/wp-json/wp/v2/primary_tag', 
		function(tags) {
						//$.each(stories, function() {stories.map(renderStory); })		 
		 
		tags.map(renderTag);
		
		})}
getTag();

function renderAffiliation(affiliation){
 affiliation=affiliation
 affiliation_id=affiliation.id
 name = affiliation.name

}

function getAffiliation(){
		$.getJSON('http://staging-lrsm.anagraph.io/wp-json/wp/v2/affiliation', 
		function(affilations) {
						//$.each(stories, function() {stories.map(renderStory); })		 
		 
		affilations.map(renderAffiliation);
		
		})}
getAffiliation();


function renderProject(project){
	 project=project
	 project_id=project.id
	 name = project.name

}

function getProject(){
		$.getJSON('http://staging-lrsm.anagraph.io/wp-json/wp/v2/project', 
		function(projects) {
						
		projects.map(renderProject);
		
		})}
getProject();
