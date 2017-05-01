// A highlight.js file for the BZW specification
//     ported from https://forums.bzflag.org/viewtopic.php?f=24&t=16037#p148953
//     thank you, Yrogirg

function(hljs) {

  // These options are blacklisted and cannot be used from inside a BZW, so we'll ignore them in the OPTIONS_BLOCK
  //
  // '-badwords', '-ban', '-banfile', '-cache', '-cacheout', '-conf', '-d', '-filterCallsigns', '-filterChat',
  // '-filterSimple', '-groupdb', '-i', '-masterBanURL', '-noMasterBanlist', '-p', '-passwd', '-password', '-pidfile',
  // '-publicaddr', '-publiclist', '-publickey', '-q', '-recbuf', '-recbufonly', '-recdir', '-replay', '-reportfile',
  // '-reportpipe', '-ts', '-UPnP', '-utc', '-userdb', '-version', '-w', '-world'

  var FLAGS =
    'good bad R* G* B* P* ' +
    'A BU CS CL G GM IB ID JP L LG MG MQ N OO PZ QT F R SE SH SW ST SR SB TH T US V WG ' +
    'B BY CB FO JM LT M NJ O RC RO RT TR WA ';
  var OPTIONS_BLOCK =
    '-a -adminlagannounce -admsg -advertise -autoTeam -b -c -cr -density num -disableBots ' +
    '-f +f -fb -g -h -handicap -help -helpmsg -j -jitterdrop -jitterwarn -lagannounce ' +
    '-lagdrop -lagwarn -maxidle -mp -mps -ms -mts -offa -packetlossdrop -packetlosswarn ' +
    '-poll -q +r -rabbit +s -s -sa -sb -set -sl -spamtime -spamwarn -speedtol ' +
    '-srvmsg -st -sw -synctime -t -tftimeout -time -timemanual -tk -printscore -tkkr ' +
    '-trackplayhistory -vars -worldsize ';
  var BZDB_OPTIONS = 
    '_agilityAdVel _agilityTimeWindow _agilityVelDelta _ambientLight _angleTolerance _angularAd ' + 
    '_avenueSize _baseSize _boxBase _boxHeight _burrowDepth _burrowSpeedAd _burrowAngularAd ' + 
    '_coldetDepth _coldetElements _countdownResumeDelay _cullDepth _cullDist _cullElements ' + 
    '_cullOccluders _disableBots _disableSpeedChecks _disableHeightChecks _drawCelestial _drawClouds ' + 
    '_drawGround _drawGroundLights _drawMountains _drawSky _enableDistanceCheck _endShotDetection ' + 
    '_explodeTime _flagAltitude _flagEffectTime _flagHeight _flagPoleWidth _flagPoleSize _flagRadius ' + 
    '_fogMode _fogDensity _fogStart _fogEnd _fogColor _fogNoSky _friction _gmActivationTime ' + 
    '_gmAdLife _gmTurnAngle _gravity _handicapScoreDiff _handicapVelAd _handicapAngAd _handicapShotAd ' + 
    '_identifyRange _inertiaAngular _inertiaLinear _jumpVelocity _laserAdVel _laserAdRate _laserAdLife ' + 
    '_latitude _lgGravity _lockOnAngle _longitude _lRAdRate _maxBumpHeight _maxFlagGrabs _maxLOD ' + 
    '_mirror _momentumLinAcc _momentumAngAcc _momentumFriction _mGunAdVel _mGunAdRate _mGunAdLife ' + 
    '_muzzleFront _muzzleHeight _noClimb _noShadows _noSmallPackets _notRespondingTime _obeseFactor ' + 
    '_pauseDropTime _positionTolerance _pyrBase _pyrHeight _radarLimit _rainBaseColor _rainDensity ' + 
    '_rainEndZ _rainMaxPuddleTime _rainPuddleSpeed _rainPuddleColor _rainPuddleTexture _rainRoofs ' + 
    '_rainSpread _rainSpeed _rainSpeedMod _rainSpins _rainStartZ _rainTexture _rainTopColor ' + 
    '_rainType _rejoinTime _rejumpTime _reloadTime _rFireAdVel _rFireAdRate _rFireAdLife ' + 
    '_shieldFlight _shockAdLife _shockInRadius _shockOutRadius _shockInRadius _shotRadius _shotRange ' +
    '_shotSpeed _shotTailLength _shotsKeepVerticalVelocity _skyColor _spawnMaxCompTime _spawnSafeRadMod ' + 
    '_spawnSafeSRMod _spawnSafeSWMod _speedChecksLogOnly _srRadiusMult _squishFactor _squishTime ' + 
    '_syncTime _syncLocation _tankAngVel _tankExplosionSize _tankHeight _tankLength _tankRadius ' + 
    '_tankSpeed _tankWidth _targetingAngle _teleportBreadth _teleportHeight _teleportTime ' + 
    '_teleportWidth _thiefAdLife _thiefAdRate _thiefAdShotVel _thiefTinyFactor _thiefVelAd ' + 
    '_thiefDropTime _tinyFactor _trackFade _updateThrottleRate _useLineRain _useRainPuddles ' + 
    '_useRainBillboards _velocityAd _wallHeight _weapons _wideAngleAng _wingsGravity _wingsJumpCount ' + 
    '_wingsJumpVelocity _wingsSlideTime _worldSize ';
  var SKYBOX =
    'GroundMaterial WaterMaterial LinkMaterial LeftSkyboxMaterial RightSkyboxMaterial FrontSkyboxMaterial ' +
    'BackSkyboxMaterial TopSkyboxMaterial BottomSkyboxMaterial ';
  var OBJECT_HEADERS =
    'world options waterLevel dynamicColor textureMatrix material transform physics ';
  var WORLD_OBJECTS =
    'arc base box cone define group link mesh meshbox meshpyr pyramid sphere teleporter tetra weapon zone face endface enddef drawInfo lod end ';
  var WORLD_PARAMS =
    'size flagHeight noWalls freeCtfSpawns ';
  var WATER_PARAMS =
    'height materials ';
  var DYNAMIC_COLORS =
    'red green blue alpha ';
  var TEXMAT_PARAMS = 
    'scale spin shift center fixedscale fixedspin fixedshift ';
  var MATERIAL_PARAMS =
    'texture addtexture notextures notexcolor notexalpha texmat dyncol ambient diffuse color specular emission shininess ' +
    'resetmat spheremap noradar noshadow noculling nosorting nolighting alphathresh groupalpha occluder ';
  var PHYSICS_PARAMS =
    'linear angular slide death ';
  var ARC_PARAMS =
    'divisions flatshading angle ratio position rotation size shift shear scale spin texsize phydrv ricochet smoothbounce ' +
    'matref top bottom inside outside startside endside ';
  var POSTION_PARAMS =
    'pos position size rot rotation ';
  var PHASEABLE_PARAMS = 
    'passable drivethrough shootthrough ricochet ';
  var BASE_PARAMS =
    'color oncap ';
  var BOX_PARAMS =
    'top bottom sides obstacle outside texsize texoffset ';
  var TELEPORTER_PARAMS =
    'border from to ';
  var MESH_PARAMS =
    'vertex normal texcoord noclusters passable vertices normals texcoords ';
  var PYRAMID_PARAMS =
    'edge bottom startside endside flipz angle ';
  var SPHERE_PARAMS =
    'hemisphere hemi radius ';
  var WEAPON_PARAMS =
    'tilt initdelay delay type trigger eventteam ';
  var ZONE_PARAMS =
    'zoneflag flag safety ';
  var MISC_PARAMS =
    'name phydrv team tint ';

  var COMMENT_MODES = [
    hljs.COMMENT(
      /#/,
      /$/,
      {
        relevance: 0
      }
    )
  ];

  return {
    case_insensitive: true,
    keywords: {
      keyword:
        OBJECT_HEADERS + WORLD_OBJECTS,
      built_in:
        WORLD_PARAMS + WATER_PARAMS + DYNAMIC_COLORS + TEXMAT_PARAMS + MATERIAL_PARAMS + PHYSICS_PARAMS + ARC_PARAMS +
        POSTION_PARAMS + PHASEABLE_PARAMS + BASE_PARAMS + BOX_PARAMS + TELEPORTER_PARAMS + MESH_PARAMS + PYRAMID_PARAMS +
        SPHERE_PARAMS + WEAPON_PARAMS + ZONE_PARAMS + MISC_PARAMS,
      literal:
        FLAGS + SKYBOX
    },
    contains: [
      {
        case_insensitive: false,
        returnBegin: true, returnEnd: true,
        begin: 'options', end: 'end',
        lexemes: '[-+_]?[a-zA-Z]+',
        keywords: {
          keyword: 'options',
          built_in: OPTIONS_BLOCK,
          literal: BZDB_OPTIONS
        },
        contains: COMMENT_MODES
      },
      hljs.C_NUMBER_MODE
    ].concat(COMMENT_MODES)
  }
}
